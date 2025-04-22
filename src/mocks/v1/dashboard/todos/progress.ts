import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";
import { DashboardTodoProgressResponse } from "@/types/dashboard";

import { TODO_MOCK_DATA } from "../../todos/mock-data";

export const getDashboardProgress = http.get<
  never,
  never,
  DashboardTodoProgressResponse
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.DASHBOARD.PROGRESS}`,
  async () => {
    return HttpResponse.json(
      {
        progress:
          TODO_MOCK_DATA.length === 0
            ? 0
            : (TODO_MOCK_DATA.filter((todo) => todo.isDone).length /
                TODO_MOCK_DATA.length) *
              100,
      },
      { status: 200 },
    );
  },
);
