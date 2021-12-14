import { RootState } from './../../app/store';
import { Notification } from '../../app/types';
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  PayloadAction,
} from '@reduxjs/toolkit';

import { client } from '../../api/client';

const notificationsAdapter = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

export const fetchNotifications = createAsyncThunk<
  Notification[],
  undefined,
  {
    state: RootState;
  }
>('notifications/fetchNotifications', async (_, { getState }) => {
  const allNotifications = selectAllNotifications(getState());
  const [latestNotification] = allNotifications;
  const latestTimestamp = latestNotification ? latestNotification.date : '';
  const response = await client.get(
    `/fakeApi/notifications?since=${latestTimestamp}`
  );
  return response.data;
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state) {
      Object.values(state.entities).forEach((notification) => {
        if (notification) {
          notification.read = true;
        }
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(
      fetchNotifications.fulfilled,
      (state, action: PayloadAction<Notification[]>) => {
        // Add client-side metadata for tracking new notifications
        const notificationsWithMetadata = action.payload.map(
          (notification) => ({
            ...notification,
            read: false,
            isNew: true,
          })
        );

        Object.values(state.entities).forEach((notification) => {
          // Any notifications we've read are no longer new
          if (notification) {
            notification.isNew = !notification.read;
          }
        });

        notificationsAdapter.upsertMany(state, notificationsWithMetadata);
      }
    );
  },
});

export const { allNotificationsRead } = notificationsSlice.actions;

export default notificationsSlice.reducer;

export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state: RootState) => state.notifications);
