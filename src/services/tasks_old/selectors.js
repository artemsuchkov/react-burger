export const selectTasks = (state) => state.tasks.tasks;
export const selectTasksLoading = (state) => state.tasks.loading;
export const selectTasksError = (state) => state.tasks.error;

/* export const selectTasksWithThree = createSelector(
  [selectTasks, (state) => state.auth.user],
  (tasks, user) => tasks.filter((task) => task.content.includes('3'))
); */
