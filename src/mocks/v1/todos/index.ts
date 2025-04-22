import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";
import { TodoListResponse } from "@/types/todo";

import { createTodo, deleteTodo, getTodoDetail, updateTodo } from "./[todoId]";
import { getTodosLengths } from "./info/status";
import { TODO_MOCK_DATA } from "./mock-data";

export const getTodos = http.get<never, never, TodoListResponse>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.TODO.GET_ALL}`,
  async ({ request }) => {
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

    return HttpResponse.json(
      {
        paginationInformation: {
          nextCursor,
          totalCount: slicedTodos.length,
          hasNext,
        },
        todos: slicedTodos,
      },
      { status: 200 },
    );
  },
);

export const TodoHandlers = [
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodoDetail,
  getTodosLengths,
];
