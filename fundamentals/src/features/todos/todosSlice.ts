import { Todo } from '../../app/types';
import {
  createSlice,
  createSelector,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';
import { client } from '../../api/client';
import { RootState } from '../../app/store';
import { StatusFilters } from '../filters/filtersSlice';

const todosAdapter = createEntityAdapter<Todo>();

const initialState = todosAdapter.getInitialState({
  status: 'idle',
});

// Thunk functions
export const fetchTodos = createAsyncThunk<Todo[]>(
  'todos/fetchTodos',
  async () => {
    const response = await client.get('/fakeApi/todos');
    return response.todos;
  }
);

export const saveNewTodo = createAsyncThunk(
  'todos/saveNewTodo',
  async (text: string) => {
    const initialTodo = { text };
    const response = await client.post('/fakeApi/todos', { todo: initialTodo });
    return response.todo;
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    todoToggled(state, action) {
      const todoId = action.payload;
      const todo = state.entities[todoId];
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    todoColorSelected: {
      reducer(state, action: PayloadAction<{ todoId: number; color: string }>) {
        const { color, todoId } = action.payload;
        const existingToDo = state.entities[todoId];
        if (existingToDo) {
          existingToDo.color = color;
        }
      },
      prepare(todoId, color) {
        return {
          payload: { todoId, color },
        };
      },
    },
    todoDeleted: todosAdapter.removeOne,
    allTodosCompleted(state) {
      Object.values(state.entities).forEach((todo) => {
        todo && (todo.completed = true);
      });
    },
    completedTodosCleared(state) {
      const completedIds = Object.values(state.entities)
        .filter((todo) => todo && todo.completed)
        .map((todo) => todo && todo.id)
        .filter(
          (item): item is Exclude<typeof item, undefined> => item !== undefined
        );
      todosAdapter.removeMany(state, completedIds);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        todosAdapter.setAll(state, action.payload);
        state.status = 'idle';
      })
      .addCase(saveNewTodo.fulfilled, todosAdapter.addOne);
  },
});

export const {
  allTodosCompleted,
  completedTodosCleared,
  // todoAdded,
  todoColorSelected,
  todoDeleted,
  todoToggled,
} = todosSlice.actions;

export default todosSlice.reducer;

export const { selectAll: selectTodos, selectById: selectTodoById } =
  todosAdapter.getSelectors<RootState>((state) => state.todos);

export const selectTodoIds = createSelector(
  // First, pass one or more "input selector" functions:
  selectTodos,
  // Then, an "output selector" that receives all the input results as arguments
  // and returns a final result value
  (todos) => todos.map((todo) => todo.id)
);

export const selectFilteredTodos = createSelector(
  // First input selector: all todos
  selectTodos,
  // Second input selector: all filter values
  (state: RootState) => state.filters,
  // Output selector: receives both values
  (todos, filters) => {
    const { status, colors } = filters;
    const showAllCompletions = status === StatusFilters.All;
    if (showAllCompletions && colors.length === 0) {
      return todos;
    }

    const completedStatus = status === StatusFilters.Completed;
    // Return either active or completed todos based on filter
    return todos.filter((todo) => {
      const statusMatches =
        showAllCompletions || todo.completed === completedStatus; // completedに当てはまらないものはActive.
      const colorMatches = colors.length === 0 || colors.includes(todo.color);
      return statusMatches && colorMatches;
    });
  }
);

export const selectFilteredTodoIds = createSelector(
  // Pass our other memoized selector as an input
  selectFilteredTodos,
  // And derive data in the output selector
  (filteredTodos) => filteredTodos.map((todo) => todo.id)
);
