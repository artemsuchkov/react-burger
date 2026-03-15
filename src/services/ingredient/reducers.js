import { SHOW_INGREDIENT } from './actions.js';

const initialState = {
  ingredient: [],
};

export const ingredientReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_INGREDIENT:
      return {
        ...state,
        ingredient: [...action.payload],
      };
    default:
      return state;
  }
};
