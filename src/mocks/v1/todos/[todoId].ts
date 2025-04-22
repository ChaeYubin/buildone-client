import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";
import { TodoParams } from "@/services/todo";
import { CommonResponseError } from "@/types/index";
import { TodoResponse } from "@/types/todo";

import { GOAL_LIST_MOCK_DATA } from "../goal/mock-data";

import { TODO_MOCK_DATA } from "./mock-data";

export const createTodo = http.post<
  never,
  TodoParams,
  TodoResponse | CommonResponseError
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.TODO.CREATE}`,
  async ({ request }) => {
    const { title, fileUrl, linkUrl, isDone, goalId } = await request.json();

    const goal = goalId
      ? GOAL_LIST_MOCK_DATA.goals.find((g) => g.id === goalId)
      : null;

    if (goalId && !goal) {
      return HttpResponse.json(
        {
          code: "NOT_FOUND_GOAL",
          message: "해당 목표가 존재하지 않습니다.",
        },
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

    return HttpResponse.json(
      {
        ...newTodo,
      },
      { status: 200 },
    );
  },
);

export const updateTodo = http.put<
  { todoId: string },
  TodoParams,
  TodoResponse | CommonResponseError
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/todos/:todoId`,
  async ({ params, request }) => {
    const { todoId } = params;
    const updatedTodo = await request.json();

    const todoIndex = TODO_MOCK_DATA.findIndex(
      (todo) => todo.id === Number(todoId),
    );

    if (todoIndex === -1) {
      return HttpResponse.json(
        {
          code: "NOT_FOUND_TODO",
          message: "해당 Todo가 존재하지 않습니다.",
        },
        { status: 400 },
      );
    }

    TODO_MOCK_DATA[todoIndex] = {
      ...TODO_MOCK_DATA[todoIndex],
      ...updatedTodo,
    };

    return HttpResponse.json(
      {
        ...TODO_MOCK_DATA[todoIndex],
      },
      { status: 200 },
    );
  },
);

export const deleteTodo = http.delete<{ todoId: string }>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/todos/:todoId`,
  async ({ params }) => {
    const { todoId } = params;

    const todoIndex = TODO_MOCK_DATA.findIndex(
      (todo) => todo.id === Number(todoId),
    );

    if (todoIndex === -1) {
      return HttpResponse.json(
        {
          code: "NOT_FOUND_TODO",
          message: "해당 Todo가 존재하지 않습니다.",
        },
        { status: 400 },
      );
    }

    TODO_MOCK_DATA.splice(todoIndex, 1);

    return HttpResponse.json({}, { status: 200 });
  },
);

export const getTodoDetail = http.get<
  { todoId: string },
  never,
  TodoResponse | CommonResponseError
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/todos/:todoId`,
  async ({ params }) => {
    const { todoId } = params;

    const todo = TODO_MOCK_DATA.find((t) => t.id === Number(todoId));

    if (!todo) {
      return HttpResponse.json(
        {
          code: "NOT_FOUND_TODO",
          message: "해당 Todo가 존재하지 않습니다.",
        },
        { status: 400 },
      );
    }

    return HttpResponse.json({ ...todo }, { status: 200 });
  },
);
