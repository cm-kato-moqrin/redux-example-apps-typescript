import React, { ChangeEventHandler } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { ReactComponent as TimesSolid } from './times-solid.svg';

import { availableColors, capitalize } from '../filters/colors';
import {
  todoColorSelected,
  todoDeleted,
  todoToggled,
  selectTodoById,
} from './todosSlice';

type todoListItemProps = { id: number };
// Destructure `props.id`, since we just need the ID value
const TodoListItem = ({ id }: todoListItemProps) => {
  // Call our `selectTodoById` with the state _and_ the ID value
  const todo = useAppSelector((state) => selectTodoById(state, id));

  const dispatch = useAppDispatch();

  if (!todo) {
    return (
      <section>
        <h2>Todo not found!</h2>
      </section>
    );
  }

  const { text, completed, color } = todo;

  const handleCompletedChanged = () => {
    dispatch(todoToggled(todo.id));
  };

  const handleColorChanged: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const color = e.target.value;
    dispatch(todoColorSelected(todo.id, color));
  };

  const onDelete = () => {
    dispatch(todoDeleted(todo.id));
  };

  const colorOptions = availableColors.map((c) => (
    <option key={c} value={c}>
      {capitalize(c)}
    </option>
  ));

  return (
    <li>
      <div className='view'>
        <div className='segment label'>
          <input
            className='toggle'
            type='checkbox'
            checked={completed}
            onChange={handleCompletedChanged}
          />
          <div className='todo-text'>{text}</div>
        </div>
        <div className='segment buttons'>
          <select
            className='colorPicker'
            value={color}
            style={{ color }}
            onChange={handleColorChanged}
          >
            <option value=''></option>
            {colorOptions}
          </select>
          <button className='destroy' onClick={onDelete}>
            <TimesSolid />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TodoListItem;
