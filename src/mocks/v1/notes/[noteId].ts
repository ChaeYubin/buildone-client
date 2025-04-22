import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";
import { CommonResponseError } from "@/types/index";
import { NoteResponse } from "@/types/note";

import { GOAL_MOCK_DATA } from "../goal/mock-data";
import { TODO_MOCK_DATA } from "../todos/mock-data";

import { NOTE_MOCK_DATA } from "./mock-data";

export const getNote = http.get<
  { noteId: string },
  never,
  NoteResponse | CommonResponseError
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/notes/:noteId`,
  async ({ params }) => {
    const { noteId } = params;

    const note = NOTE_MOCK_DATA.find((n) => n.id === Number(noteId));

    if (!note) {
      return HttpResponse.json(
        {
          code: "NOT_FOUND_NOTE",
          message: "해당 노트가 존재하지 않습니다.",
        },
        { status: 400 },
      );
    }

    return HttpResponse.json(note, { status: 200 });
  },
);

export const createNote = http.post<
  never,
  {
    todoId: number;
    title: string;
    content: string;
    linkUrl: string;
    tags: string[];
  },
  NoteResponse | CommonResponseError
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.NOTES.CREATE}`,
  async ({ request }) => {
    const { todoId, title, content, linkUrl, tags } = await request.json();

    const todoIndex = TODO_MOCK_DATA.findIndex((t) => t.id === todoId);

    if (todoIndex === -1) {
      return HttpResponse.json(
        {
          code: "NOT_FOUND_TODO",
          message: "해당 할 일이 존재하지 않습니다.",
        },
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

    return HttpResponse.json(newNote, { status: 200 });
  },
);

export const updateNote = http.put<
  { noteId: string },
  { title: string; content: string; linkUrl: string; tags: string[] },
  NoteResponse | CommonResponseError
>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/notes/:noteId`,
  async ({ params, request }) => {
    const { noteId } = params;
    const payload = await request.json();

    const noteIndex = NOTE_MOCK_DATA.findIndex((n) => n.id === Number(noteId));

    if (noteIndex === -1) {
      return HttpResponse.json(
        {
          code: "NOT_FOUND_NOTE",
          message: "해당 노트가 존재하지 않습니다.",
        },
        { status: 400 },
      );
    }

    const note = { ...NOTE_MOCK_DATA[noteIndex], ...payload };
    NOTE_MOCK_DATA[noteIndex] = note;

    return HttpResponse.json(note, { status: 200 });
  },
);

export const deleteNote = http.delete<{ noteId: string }>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/api/v1/notes/:noteId`,
  async ({ params }) => {
    const { noteId } = params;

    const noteIndex = NOTE_MOCK_DATA.findIndex((n) => n.id === Number(noteId));

    if (noteIndex === -1) {
      return HttpResponse.json(
        {
          code: "NOT_FOUND_NOTE",
          message: "해당 노트가 존재하지 않습니다.",
        },
        { status: 400 },
      );
    }

    NOTE_MOCK_DATA.splice(noteIndex, 1);

    const todoIndex = TODO_MOCK_DATA.findIndex(
      (t) => t.noteId === Number(noteId),
    );

    TODO_MOCK_DATA[todoIndex].noteId = null;

    return HttpResponse.json({}, { status: 200 });
  },
);
