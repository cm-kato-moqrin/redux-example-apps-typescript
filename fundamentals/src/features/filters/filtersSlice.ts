import { Filter } from '../../app/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Status {
  All: string;
  Active: string;
  Completed: string;
}

export const StatusFilters: Status = {
  All: 'all',
  Active: 'active',
  Completed: 'completed',
};

let initialState: {
  status: string;
  colors: string[];
};
initialState = {
  status: StatusFilters.All,
  colors: [],
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    statusFilterChanged(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    colorFilterChanged: {
      reducer(state, action: PayloadAction<Filter>) {
        let { color, changeType } = action.payload;
        const { colors } = state;
        switch (changeType) {
          case 'added': {
            if (!colors.includes(color)) {
              colors.push(color);
            }
            break;
          }
          case 'removed': {
            state.colors = colors.filter(
              (existingColor) => existingColor !== color
            );
            break;
          }
          default:
            return;
        }
      },
      prepare(color: string, changeType: string) {
        return {
          payload: { color, changeType },
        };
      },
    },
  },
});

export const { colorFilterChanged, statusFilterChanged } = filtersSlice.actions;

export default filtersSlice.reducer;
