import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ noteId: string }> },
) => {
  const { noteId: noteIdString } = await params;

  const noteId = Number(noteIdString);
  if (Number.isNaN(noteId)) {
    return new Response(
      JSON.stringify({
        code: "INVALID_NOTE_ID",
        message: "noteId가 올바르지 않습니다. (숫자)",
      }),
      { status: 400 },
    );
  }

  // 401 에러
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !/^Bearer\s.+$/.test(authHeader)) {
    return new Response(
      JSON.stringify({
        code: "INVALID_TOKEN",
        message: "권한이 없습니다.",
      }),
      { status: 401 },
    );
  }

  // 403 에러
  if (noteId === 999) {
    return new Response(
      JSON.stringify({
        code: "NOT_ALLOW_RETRIEVE_NOTE",
        message: "노트 조회 권한이 없습니다.",
      }),
      { status: 403 },
    );
  }

  // 404 에러
  if (noteId !== 1) {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_NOTE",
        message: "노트를 찾을 수 없습니다.",
      }),
      { status: 404 },
    );
  }

  // 성공 (200)
  return new Response(
    JSON.stringify({
      id: 1,
      title: "자바스크립트 공부 정리 노트",
      content: "노트 작성 중..",
      linkUrl: "https://naver.com",
      tags: ["string"],
      goalInformation: {
        id: 1,
        title: "자바스크립트 끝내기",
      },
      todoInformation: {
        id: 1,
        title: "자바스크립트 1강 끝내기",
        linkUrl: "https://naver.com",
        fileUrl: "https://s3.apnortheast.com/",
        isDone: false,
        createdAt: "2025-03-01T23:28:34.817Z",
        updatedAt: "2025-03-01T23:28:34.817Z",
      },
      createdAt: "2025-03-01T23:28:34.817Z",
      updatedAt: "2025-03-01T23:28:34.817Z",
    }),
    { status: 200 },
  );
};
