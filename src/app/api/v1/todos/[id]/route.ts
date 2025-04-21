import { NextRequest, NextResponse } from "next/server";

import { todos } from "../generate-random-todos";

export const PUT = async (request: NextRequest) => {
  const { id, title, isDone, goalInformation, linkUrl, fileUrl } =
    await request.json();

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  todos[todoIndex] = {
    ...todos[todoIndex],
    title: title ?? todos[todoIndex].title,
    isDone: isDone ?? todos[todoIndex].isDone,
    goalInformation: goalInformation ?? todos[todoIndex].goalInformation,
    linkUrl: linkUrl ?? todos[todoIndex].linkUrl,
    fileUrl: fileUrl ?? todos[todoIndex].fileUrl,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(todos[todoIndex], { status: 200 });
};

export const DELETE = async (
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) => {
  const { id } = await params;

  if (id) return NextResponse.json({ status: 400 });

  const todoIndex = todos.findIndex((todo) => todo.id === Number(id));

  if (todoIndex === -1) return NextResponse.json({ status: 404 });
  todos.splice(todoIndex, 1);

  return NextResponse.json({ status: 200 });
};
