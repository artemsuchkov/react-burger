import { configureStore } from '@reduxjs/toolkit';

import ingredientsSlice from './ingredients/slice.js';
import userSlice from './user/slice.js';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice,
    user: userSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
