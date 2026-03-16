import { createAsyncThunk } from '@reduxjs/toolkit';

import { getProjectTasks } from '@utils/todoist-api.js';

export const loadIngredients = createAsyncThunk(
  'ingredients/loadIngredients',
  async () => {
    return getProjectTasks();
  }
);
