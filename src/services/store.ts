import { configureStore } from '@reduxjs/toolkit';

import ingredientsSlice from './ingredients/slice.ts';
import socketMiddleware from './middleware/middleware.ts';
import socketSlice from './orders/slice.ts';
import userSlice from './user/slice.ts';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice,
    user: userSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof configureStore>;
