import { TODO_MOCK_DATA } from "../../../todos/mock-data";

export const GET = async () => {
  return new Response(
    JSON.stringify({
      progress:
        TODO_MOCK_DATA.length === 0
          ? 0
          : (TODO_MOCK_DATA.filter((todo) => todo.isDone).length /
              TODO_MOCK_DATA.length) *
            100,
    }),
    { status: 200 },
  );
};
