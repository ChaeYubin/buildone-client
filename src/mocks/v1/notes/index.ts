import { http, HttpResponse } from "msw";

import { ENDPOINT } from "@/services/endpoint";
import { NoteListResponse } from "@/types/note";

import { createNote, deleteNote, getNote, updateNote } from "./[noteId]";
import { NOTE_MOCK_DATA } from "./mock-data";

export const getNotes = http.get<never, never, NoteListResponse>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.NOTES.LIST}`,
  async ({ request }) => {
    const url = new URL(request.url);
    const { searchParams } = url;

    const goalId = Number(searchParams.get("goalId"));
    const size = Number(searchParams.get("size"));

    const notes = NOTE_MOCK_DATA.filter(
      (note) => note.goalInformation?.id === goalId,
    ).reverse();

    return HttpResponse.json(
      {
        paginationInformation: {
          nextCursor: size + 1,
        },
        notes,
      },
      { status: 200 },
    );
  },
);

export const NoteHandlers = [
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
];
