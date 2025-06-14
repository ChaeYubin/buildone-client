import { GOAL_MOCK_DATA } from "./mock-data";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const { searchParams } = url;

  const cursor = Number(searchParams.get("cursor"));
  const size = Number(searchParams.get("size"));
  const sortOrder =
    searchParams.get("sortOrder") === null
      ? "newest"
      : searchParams.get("sortOrder");

  const sortedGoals = [...GOAL_MOCK_DATA].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.id - a.id;
    }
    return a.id - b.id;
  });

  const slicedGoals = sortedGoals.slice(cursor, cursor + size);

  const nextCursor = cursor + slicedGoals.length;
  const hasNext = nextCursor < sortedGoals.length;

  return new Response(
    JSON.stringify({
      paginationInformation: {
        nextCursor,
        totalCount: sortedGoals.length,
        hasNext,
      },
      goals: slicedGoals,
    }),
    { status: 200 },
  );
};

export const POST = async (request: Request) => {
  const { title } = await request.json();

  const newGoal = {
    id: Math.max(...GOAL_MOCK_DATA.map((g) => g.id), 0) + 1,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  GOAL_MOCK_DATA.push(newGoal);

  return new Response(
    JSON.stringify({
      ...newGoal,
    }),
    { status: 200 },
  );
};
