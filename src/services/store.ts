import { configureStore } from '@reduxjs/toolkit';

import ingredientsSlice from './ingredients/slice.ts';
import userSlice from './user/slice.ts';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof configureStore>;
