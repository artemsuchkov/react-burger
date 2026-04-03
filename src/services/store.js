import { configureStore } from '@reduxjs/toolkit';

import ingredientsSlice from './ingredients/slice.js';
import userSlice from './user/slice.js';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice,
    user: userSlice,
  },
});
