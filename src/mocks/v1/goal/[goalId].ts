import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";
import { GoalResponse } from "@/types/goal";
import { CommonResponseError } from "@/types/index";

import { GOAL_LIST_MOCK_DATA } from "./mock-data";

interface GoalParams {
  goalId: string;
}

export const getGoal = http.get<
  GoalParams,
  never,
  GoalResponse | CommonResponseError
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/goals/:goalId`,
  async ({ params }) => {
    const { goalId } = params;

    const goal = GOAL_LIST_MOCK_DATA.goals.find((g) => g.id === Number(goalId));

    if (!goal) {
      return HttpResponse.json(
        { code: "GOAL_NOT_FOUND", message: "목표가 존재하지 않습니다." },
        {
          status: 404,
        },
      );
    }

    return HttpResponse.json(
      {
        ...goal,
      },
      { status: 200 },
    );
  },
);

export const createGoal = http.post<
  never,
  { title: string },
  GoalResponse | CommonResponseError
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.GOAL.CREATE}`,
  async ({ request }) => {
    const { title } = await request.json();

    const newGoal = {
      id: Math.max(...GOAL_LIST_MOCK_DATA.goals.map((g) => g.id), 0) + 1,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    GOAL_LIST_MOCK_DATA.goals.push(newGoal);

    return HttpResponse.json(
      {
        ...newGoal,
      },
      { status: 200 },
    );
  },
);

export const deleteGoal = http.delete<GoalParams>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/goals/:goalId`,
  async ({ params }) => {
    const { goalId } = params;

    const goalIndex = GOAL_LIST_MOCK_DATA.goals.findIndex(
      (goal) => goal.id === Number(goalId),
    );

    if (goalIndex === -1) {
      return HttpResponse.json(
        {
          code: "GOAL_NOT_FOUND",
          message: "목표가 존재하지 않습니다.",
        },
        { status: 404 },
      );
    }

    GOAL_LIST_MOCK_DATA.goals.splice(goalIndex, 1);

    return HttpResponse.json({}, { status: 200 });
  },
);

export const updateGoal = http.put<GoalParams, { title: string }>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/goals/:goalId`,
  async ({ params, request }) => {
    const { goalId } = params;
    const { title } = await request.json();

    const goalIndex = GOAL_LIST_MOCK_DATA.goals.findIndex(
      (goal) => goal.id === Number(goalId),
    );

    if (goalIndex === -1) {
      return HttpResponse.json(
        {
          code: "GOAL_NOT_FOUND",
          message: "목표가 존재하지 않습니다.",
        },
        { status: 404 },
      );
    }

    GOAL_LIST_MOCK_DATA.goals[goalIndex].updatedAt = new Date().toISOString();
    GOAL_LIST_MOCK_DATA.goals[goalIndex].title = title;

    return HttpResponse.json({}, { status: 200 });
  },
);
