import { TodoResponse } from "@/types/todo";

import { GOAL_MOCK_DATA } from "../goals/mock-data";

import { TODO_MOCK_DATA } from "./mock-data";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const { searchParams } = url;

  const cursor = Number(searchParams.get("cursor"));
  const size = Number(searchParams.get("size"));

  const doneParam = searchParams.get("done");
  const goalIdParam = searchParams.get("goalId");

  const done = doneParam === null ? null : doneParam === "true";
  const goalId = goalIdParam === null ? null : Number(goalIdParam);

  let filteredTodos = TODO_MOCK_DATA;

  if (goalId !== null) {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.goalInformation?.id === goalId,
    );
  }

  if (done !== null) {
    filteredTodos = filteredTodos.filter((todo) => todo.isDone === done);
  }

  const slicedTodos = filteredTodos.slice(cursor, cursor + size);
  const nextCursor = cursor + slicedTodos.length;
  const hasNext = nextCursor < filteredTodos.length;

  return new Response(
    JSON.stringify({
      paginationInformation: {
        nextCursor,
        totalCount: slicedTodos.length,
        hasNext,
      },
      todos: slicedTodos,
    }),
    { status: 200 },
  );
};

export const POST = async (request: Request) => {
  const { title, fileUrl, linkUrl, isDone, goalId } = await request.json();

  const goal = goalId ? GOAL_MOCK_DATA.find((g) => g.id === goalId) : null;

  if (goalId && !goal) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_GOAL",
        message: "해당 목표가 존재하지 않습니다.",
      }),
      { status: 400 },
    );
  }

  const newTodo: TodoResponse = {
    id: Math.max(...TODO_MOCK_DATA.map((todo) => todo.id)) + 1,
    title,
    fileUrl: fileUrl || null,
    linkUrl: linkUrl || null,
    isDone,
    goalInformation: goal
      ? {
          id: goal.id,
          title: goal.title,
        }
      : null,
    noteId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  TODO_MOCK_DATA.push(newTodo);

  return new Response(JSON.stringify(newTodo), { status: 200 });
};
