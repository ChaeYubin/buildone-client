import { QueryClient } from "@tanstack/react-query";

import { dashboardKeys, goalKeys, todoKeys } from "./query-key";

export const invalidateGoalRelatedQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: goalKeys.all });
  queryClient.invalidateQueries({ queryKey: dashboardKeys.progress() });
};

export const invalidateTodoRelatedQueries = (
  queryClient: QueryClient,
  goalId?: number,
) => {
  queryClient.invalidateQueries({ queryKey: todoKeys.all });
  queryClient.invalidateQueries({ queryKey: dashboardKeys.recent() });
  queryClient.invalidateQueries({ queryKey: dashboardKeys.progress() });

  if (goalId) {
    queryClient.invalidateQueries({ queryKey: goalKeys.progress(goalId) });
  }
};
