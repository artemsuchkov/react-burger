import { configureStore } from '@reduxjs/toolkit';

import ingredientsReducer from './ingredients/reducers.js';
import userSlice from './user/slice.js';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    user: userSlice,
  },
});
