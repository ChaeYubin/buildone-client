import { TODO_MOCK_DATA } from "../../todos/mock-data";
import { NOTE_MOCK_DATA } from "../mock-data";

export const GET = async (
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ noteId: string }>;
  },
) => {
  const { noteId } = await params;

  const note = NOTE_MOCK_DATA.find((n) => n.id === Number(noteId));

  if (!note) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_NOTE",
        message: "해당 노트가 존재하지 않습니다.",
      }),
      { status: 400 },
    );
  }

  return new Response(JSON.stringify(note), { status: 200 });
};

export const DELETE = async (
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ noteId: string }>;
  },
) => {
  const { noteId } = await params;

  const noteIndex = NOTE_MOCK_DATA.findIndex((n) => n.id === Number(noteId));

  if (noteIndex === -1) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_NOTE",
        message: "해당 노트가 존재하지 않습니다.",
      }),
      { status: 400 },
    );
  }

  NOTE_MOCK_DATA.splice(noteIndex, 1);

  const todoIndex = TODO_MOCK_DATA.findIndex(
    (t) => t.noteId === Number(noteId),
  );

  TODO_MOCK_DATA[todoIndex].noteId = null;

  return new Response(JSON.stringify({}), { status: 200 });
};

export const PUT = async (
  request: Request,
  {
    params,
  }: {
    params: Promise<{ noteId: string }>;
  },
) => {
  const { noteId } = await params;
  const payload = await request.json();

  const noteIndex = NOTE_MOCK_DATA.findIndex((n) => n.id === Number(noteId));

  if (noteIndex === -1) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_NOTE",
        message: "해당 노트가 존재하지 않습니다.",
      }),
      { status: 400 },
    );
  }

  const note = { ...NOTE_MOCK_DATA[noteIndex], ...payload };
  NOTE_MOCK_DATA[noteIndex] = note;

  return new Response(JSON.stringify(note), { status: 200 });
};
