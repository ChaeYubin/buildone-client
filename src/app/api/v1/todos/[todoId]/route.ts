import { TODO_MOCK_DATA } from "../mock-data";

export const GET = async (
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ todoId: string }>;
  },
) => {
  const { todoId } = await params;

  const todo = TODO_MOCK_DATA.find((t) => t.id === Number(todoId));

  if (!todo) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_TODO",
        message: "해당 Todo가 존재하지 않습니다.",
      }),
      { status: 400 },
    );
  }

  return new Response(JSON.stringify(todo), { status: 200 });
};

export const DELETE = async (
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ todoId: string }>;
  },
) => {
  const { todoId } = await params;

  const todoIndex = TODO_MOCK_DATA.findIndex(
    (todo) => todo.id === Number(todoId),
  );

  if (todoIndex === -1) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_TODO",
        message: "해당 Todo가 존재하지 않습니다.",
      }),
      { status: 400 },
    );
  }

  TODO_MOCK_DATA.splice(todoIndex, 1);

  return new Response(JSON.stringify({}), { status: 200 });
};

export const PUT = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{ todoId: string }>;
  },
) => {
  const { todoId } = await params;
  const updatedTodo = await request.json();

  const todoIndex = TODO_MOCK_DATA.findIndex(
    (todo) => todo.id === Number(todoId),
  );

  if (todoIndex === -1) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_TODO",
        message: "해당 Todo가 존재하지 않습니다.",
      }),
      { status: 400 },
    );
  }

  TODO_MOCK_DATA[todoIndex] = {
    ...TODO_MOCK_DATA[todoIndex],
    ...updatedTodo,
  };

  return new Response(JSON.stringify(TODO_MOCK_DATA[todoIndex]), {
    status: 200,
  });
};
