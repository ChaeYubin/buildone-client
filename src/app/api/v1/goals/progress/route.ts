import { TODO_MOCK_DATA } from "../../todos/mock-data";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const { searchParams } = url;
  const goalIdParam = searchParams.get("goalId");
  const goalId = goalIdParam === null ? null : Number(goalIdParam);

  const goalTodos = TODO_MOCK_DATA.filter(
    (todo) => todo.goalInformation?.id === Number(goalId),
  );

  if (!goalTodos) {
    return new Response(
      JSON.stringify({
        code: "GOAL_NOT_FOUND",
        message: "목표가 존재하지 않습니다.",
      }),
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

  return new Response(
    JSON.stringify({
      progress: progressResult,
    }),
    { status: 200 },
  );
};
