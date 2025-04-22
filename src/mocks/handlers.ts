import { AuthHandlers } from "./v1/auth";
import { ProfileHandlers } from "./v1/dashboard/shared";
import { DashboardHandlers } from "./v1/dashboard/todos";
import { GoalHandlers } from "./v1/goal";
import { NoteHandlers } from "./v1/notes";
import { TodoHandlers } from "./v1/todos";

export const handlers = [
  ...AuthHandlers,
  ...DashboardHandlers,
  ...GoalHandlers,
  ...TodoHandlers,
  ...NoteHandlers,
  ...ProfileHandlers,
];
