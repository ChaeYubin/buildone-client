import { NoteResponse } from "@/types/note";

import { GOAL_MOCK_DATA } from "../goals/mock-data";
import { TODO_MOCK_DATA } from "../todos/mock-data";

import { NOTE_MOCK_DATA } from "./mock-data";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const { searchParams } = url;

  const goalId = Number(searchParams.get("goalId"));
  const size = Number(searchParams.get("size"));

  const notes = NOTE_MOCK_DATA.filter(
    (note) => note.goalInformation?.id === goalId,
  ).reverse();

  return new Response(
    JSON.stringify({
      paginationInformation: {
        nextCursor: size + 1,
      },
      notes,
    }),
    { status: 200 },
  );
};

export const POST = async (request: Request) => {
  const { todoId, title, content, linkUrl, tags } = await request.json();

  const todoIndex = TODO_MOCK_DATA.findIndex((t) => t.id === todoId);

  if (todoIndex === -1) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_TODO",
        message: "해당 할 일이 존재하지 않습니다.",
      }),
      { status: 400 },
    );
  }

  const goalIndex = GOAL_MOCK_DATA.findIndex(
    (g) => g.id === TODO_MOCK_DATA[todoIndex].goalInformation?.id,
  );

  const newNote: NoteResponse = {
    id: Math.max(0, ...NOTE_MOCK_DATA.map((note) => note.id)) + 1,
    title,
    content,
    linkUrl,
    tags,
    goalInformation: {
      id: GOAL_MOCK_DATA[goalIndex].id,
      title: GOAL_MOCK_DATA[goalIndex].title,
    },
    todoInformation: {
      ...TODO_MOCK_DATA[todoIndex],
      linkUrl: TODO_MOCK_DATA[todoIndex].linkUrl || "",
      fileUrl: TODO_MOCK_DATA[todoIndex].fileUrl || "",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  TODO_MOCK_DATA[todoIndex].noteId = NOTE_MOCK_DATA.length + 1;
  NOTE_MOCK_DATA.push(newNote);

  return new Response(JSON.stringify(newNote), { status: 200 });
};
