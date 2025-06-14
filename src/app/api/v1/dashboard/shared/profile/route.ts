import { NoteResponse } from "@/types/note";

import { GOAL_MOCK_DATA } from "../../../goals/mock-data";
import { NOTE_MOCK_DATA } from "../../../notes/mock-data";
import { TODO_MOCK_DATA } from "../../../todos/mock-data";

const getTopTwoTags = (notes: NoteResponse[]): string[] =>
  [
    ...notes
      .flatMap((n) => n.tags)
      .reduce(
        (map, tag) => map.set(tag, (map.get(tag) || 0) + 1),
        new Map<string, number>(),
      ),
  ]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([tag]) => tag);

export const GET = async () => {
  const streakCount = Math.floor(Math.random() * 100);
  const completedGoalCount = GOAL_MOCK_DATA.filter((goal) => goal.id).map(
    (goalId) =>
      TODO_MOCK_DATA.filter(
        (todo) => todo.goalInformation?.id === Number(goalId),
      ).every((todo) => todo.isDone),
  ).length;

  const dailyAverageCompletedTodoCount = Math.floor(Math.random() * 10);

  const recentGoals = GOAL_MOCK_DATA.slice(-2).map((goal) => goal.title);
  const mostlyNoteTags = getTopTwoTags(NOTE_MOCK_DATA);

  return new Response(
    JSON.stringify({
      streakCount,
      completedGoalCount,
      dailyAverageCompletedTodoCount,
      recentGoals,
      mostlyNoteTags,
    }),

    { status: 200 },
  );
};
