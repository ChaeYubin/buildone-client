import { GOAL_MOCK_DATA } from "../mock-data";

export const GET = async (
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ goalId: string }>;
  },
) => {
  const { goalId } = await params;

  const goal = GOAL_MOCK_DATA.find((g) => g.id === Number(goalId));

  if (!goal) {
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

  return new Response(
    JSON.stringify({
      ...goal,
    }),
    { status: 200 },
  );
};

export const DELETE = async (
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ goalId: string }>;
  },
) => {
  const { goalId } = await params;

  const goalIndex = GOAL_MOCK_DATA.findIndex(
    (goal) => goal.id === Number(goalId),
  );

  if (goalIndex === -1) {
    return new Response(
      JSON.stringify({
        code: "GOAL_NOT_FOUND",
        message: "목표가 존재하지 않습니다.",
      }),
      { status: 404 },
    );
  }

  GOAL_MOCK_DATA.splice(goalIndex, 1);

  return new Response(JSON.stringify({}), { status: 200 });
};

export const PUT = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{ goalId: string }>;
  },
) => {
  const { goalId } = await params;
  const { title } = await request.json();

  const goalIndex = GOAL_MOCK_DATA.findIndex(
    (goal) => goal.id === Number(goalId),
  );

  if (goalIndex === -1) {
    return new Response(
      JSON.stringify({
        code: "GOAL_NOT_FOUND",
        message: "목표가 존재하지 않습니다.",
      }),
      { status: 404 },
    );
  }

  GOAL_MOCK_DATA[goalIndex].updatedAt = new Date().toISOString();
  GOAL_MOCK_DATA[goalIndex].title = title;

  return new Response(JSON.stringify({}), { status: 200 });
};
