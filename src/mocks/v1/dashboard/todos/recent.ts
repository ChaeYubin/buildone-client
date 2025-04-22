import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";
import { DashboardRecentTodoListResponse } from "@/types/dashboard";

import { TODO_MOCK_DATA } from "../../todos/mock-data";

export const getRecentTodos = http.get<
  never,
  never,
  DashboardRecentTodoListResponse
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.DASHBOARD.GET_TODOS}`,
  async () => {
    return HttpResponse.json(
      {
        todos: TODO_MOCK_DATA.slice(-4).reverse(),
      },
      { status: 200 },
    );
  },
);
