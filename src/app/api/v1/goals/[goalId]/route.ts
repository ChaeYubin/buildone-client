import { GoalResponse } from "@/types/dashboard";

const goalsMockData: GoalResponse[] = [
  {
    id: 1,
    title: "자바스크립트로 웹 서비스 만들기 1",
    createdAt: "2025-02-26T12:13:48.507Z",
    updatedAt: "2025-02-26T12:13:48.507Z",
  },
  {
    id: 2,
    title: "자바스크립트로 웹 서비스 만들기 2",
    createdAt: "2025-02-26T12:13:48.507Z",
    updatedAt: "2025-02-26T12:13:48.507Z",
  },
  {
    id: 3,
    title: "자바스크립트로 웹 서비스 만들기 3",
    createdAt: "2025-02-26T12:13:48.507Z",
    updatedAt: "2025-02-26T12:13:48.507Z",
  },
  {
    id: 4,
    title: "자바스크립트로 웹 서비스 만들기 4",
    createdAt: "2025-02-26T12:13:48.507Z",
    updatedAt: "2025-02-26T12:13:48.507Z",
  },
];

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ goalId: string }> },
) => {
  const { goalId: goalIdString } = await params;

  const goalId = Number(goalIdString);
  const goal = goalsMockData.find((g) => g.id === goalId);

  if (goal) {
    return new Response(JSON.stringify(goal), {
      status: 200,
    });
  }

  return new Response(
    JSON.stringify({
      code: "NOT_FOUND_GOAL",
      message: "목표를 찾을 수 없습니다.",
    }),
    {
      status: 404,
    },
  );
};

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ goalId: string }> },
) => {
  const { goalId: goalIdString } = await params;

  const goalId = Number(goalIdString);
  const goal = goalsMockData.find((g) => g.id === goalId);
  const goalIndex = goalsMockData.findIndex((g) => g.id === goalId);

  if (!goal) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_GOAL",
        message: "목표를 찾을 수 없습니다.",
      }),
      {
        status: 403,
      },
    );
  }

  goalsMockData.splice(goalIndex, 1);

  return new Response(null, {
    status: 204,
  });
};

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ goalId: string }> },
) => {
  const { goalId: goalIdString } = await params;
  const { title: newTitle } = await request.json();

  const goalId = Number(goalIdString);
  const goal = goalsMockData.find((g) => g.id === goalId);
  const goalIndex = goalsMockData.findIndex((g) => g.id === goalId);

  if (!goal) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_GOAL",
        message: "목표를 찾을 수 없습니다.",
      }),
      {
        status: 403,
      },
    );
  }

  if (newTitle === "") {
    return new Response(
      JSON.stringify({
        code: "INVALID_GOAL_TITLE",
        message: "목표 형식이 올바르지 않습니다.",
      }),
      {
        status: 400,
      },
    );
  }

  goalsMockData.splice(goalIndex, 1, { ...goal, title: newTitle });

  return new Response(
    JSON.stringify({
      ...goal,
      title: newTitle,
    }),
    {
      status: 200,
    },
  );
};
