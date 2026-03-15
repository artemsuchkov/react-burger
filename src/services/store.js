import { composeWithDevTools } from '@redux-devtools/extension';
import { combineReducers, createStore } from 'redux';

import { ingredientReducer } from './ingredient/reducers.js';
import { ingredientsReducer } from './ingredients/reducers.js';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  ingredient: ingredientReducer,
});

export const store = createStore(rootReducer, composeWithDevTools());
