import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";
import { GoalListResponse } from "@/types/goal";

import { createGoal, deleteGoal, getGoal, updateGoal } from "./[goalId]";
import { GOAL_LIST_MOCK_DATA } from "./mock-data";
import { getGoalProgress } from "./progress";

export const getGoals = http.get<never, never, GoalListResponse>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.GOAL.GET_ALL}`,
  async ({ request }) => {
    const url = new URL(request.url);
    const { searchParams } = url;

    const cursor = Number(searchParams.get("cursor"));
    const size = Number(searchParams.get("size"));
    const sortOrder =
      searchParams.get("sortOrder") === null
        ? "newest"
        : searchParams.get("sortOrder");

    const sortedGoals = [...GOAL_LIST_MOCK_DATA.goals].sort((a, b) => {
      if (sortOrder === "newest") {
        return b.id - a.id;
      }
      return a.id - b.id;
    });

    const slicedGoals = sortedGoals.slice(cursor, cursor + size);

    const nextCursor = cursor + slicedGoals.length;
    const hasNext = nextCursor < sortedGoals.length;

    return HttpResponse.json(
      {
        paginationInformation: {
          nextCursor,
          totalCount: sortedGoals.length,
          hasNext,
        },
        goals: slicedGoals,
      },
      { status: 200 },
    );
  },
);

export const GoalHandlers = [
  getGoals,
  getGoalProgress,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoal,
];
