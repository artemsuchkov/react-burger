import { SHOW_INGREDIENT } from './actions.js';

const initialState = {
  ingredients: [],
};

export const ingredientReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_INGREDIENT:
      return {
        ...state,
        ingredients: [...action.payload],
      };
    default:
      return state;
  }
};
