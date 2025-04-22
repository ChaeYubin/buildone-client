import { AuthHandlers } from "./v1/auth";
import { DashboardHandlers } from "./v1/dashboard/todos";

export const handlers = [...AuthHandlers, ...DashboardHandlers];
