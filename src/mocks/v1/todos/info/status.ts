import { http, HttpResponse } from "msw";

import { TodoLengths } from "@/components/todo/all-list-todo";
import { ENDPOINT } from "@/services/endpoint";
import { CommonResponseError } from "@/types/index";

import { TODO_MOCK_DATA } from "../mock-data";

export const getTodosLengths = http.get<
  never,
  never,
  TodoLengths | CommonResponseError
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.TODO.GET_INFO}`,
  async () => {
    const AllCount = TODO_MOCK_DATA.length;
    const todoCount = TODO_MOCK_DATA.filter((todo) => !todo.isDone).length;
    const doneCount = AllCount - todoCount;

    return HttpResponse.json(
      { AllCount, todoCount, doneCount },
      { status: 200 },
    );
  },
);
