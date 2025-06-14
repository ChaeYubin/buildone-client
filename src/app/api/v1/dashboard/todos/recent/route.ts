import { TODO_MOCK_DATA } from "../../../todos/mock-data";

export const GET = async () => {
  return new Response(
    JSON.stringify({
      todos: TODO_MOCK_DATA.slice(-4).reverse(),
    }),
    { status: 200 },
  );
};
