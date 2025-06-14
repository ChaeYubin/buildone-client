import { TODO_MOCK_DATA } from "../../mock-data";

export const GET = async () => {
  const AllCount = TODO_MOCK_DATA.length;
  const todoCount = TODO_MOCK_DATA.filter((todo) => !todo.isDone).length;
  const doneCount = AllCount - todoCount;

  return new Response(JSON.stringify({ AllCount, todoCount, doneCount }), {
    status: 200,
  });
};
