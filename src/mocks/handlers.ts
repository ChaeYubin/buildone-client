import { AuthHandlers } from "./v1/auth";
import { DashboardHandlers } from "./v1/dashboard/todos";
import { GoalHandlers } from "./v1/goal";
import { TodoHandlers } from "./v1/todos";

export const handlers = [
  ...AuthHandlers,
  ...DashboardHandlers,
  ...GoalHandlers,
  ...TodoHandlers,
];
