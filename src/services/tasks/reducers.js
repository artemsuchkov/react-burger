import { ADD_TASK_SUCCESS, REMOVE_TASK_SUCCESS, LOAD_TASK_SUCCESS } from './actions.js';

const initialState = {
  tasks: [],
};

export const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_TASK_SUCCESS:
      return {
        ...state,
        tasks: [...action.payload],
      };
    case ADD_TASK_SUCCESS:
      console.log('Добавили ингридиент');
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case REMOVE_TASK_SUCCESS:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    default:
      return state;
  }
};
