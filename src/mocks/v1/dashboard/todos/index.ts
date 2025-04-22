import { getDashboardProgress } from "./progress";
import { getRecentTodos } from "./recent";
import { getDashboardStreak } from "./streak";

export const DashboardHandlers = [
  getRecentTodos,
  getDashboardProgress,
  getDashboardStreak,
];
