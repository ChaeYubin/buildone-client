import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";

import { TODO_MOCK_DATA } from "../todos/mock-data";

export const getGoalProgress = http.get<never, { goalId: string }>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.GOAL.GET_PROGRESS}`,
  async ({ request }) => {
    const url = new URL(request.url);
    const { searchParams } = url;
    const goalIdParam = searchParams.get("goalId");
    const goalId = goalIdParam === null ? null : Number(goalIdParam);

    const goalTodos = TODO_MOCK_DATA.filter(
      (todo) => todo.goalInformation?.id === Number(goalId),
    );

    if (!goalTodos) {
      return HttpResponse.json(
        { code: "GOAL_NOT_FOUND", message: "목표가 존재하지 않습니다." },
        {
          status: 404,
        },
      );
    }

    const progressResult =
      goalTodos.length === 0
        ? 0
        : (goalTodos.filter((todo) => todo.isDone).length / goalTodos.length) *
          100;

    return HttpResponse.json(
      {
        progress: progressResult,
      },
      { status: 200 },
    );
  },
);
