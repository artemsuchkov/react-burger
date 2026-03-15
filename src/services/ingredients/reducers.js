import { LOAD_INGREDIENTS } from './actions.js';

const initialState = {
  ingredients: [],
};

export const ingredientsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...action.payload],
      };
    default:
      return state;
  }
};
