import { configureStore } from '@reduxjs/toolkit';

import { ingredientReducer } from './ingredient/reducers.js';
import ingredientsReducer from './ingredients/reducers.js';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    ingredient: ingredientReducer,
  },
});
