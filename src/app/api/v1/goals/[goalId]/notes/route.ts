import { NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> },
) => {
  const { goalId } = await params;
  const { searchParams } = request.nextUrl;
  const sizeParam = searchParams.get("size");

  // 400 에러
  if (sizeParam !== null && Number.isNaN(Number(sizeParam))) {
    return new Response(
      JSON.stringify({
        code: "INVALID_PAGINATION_SIZE",
        message: "페이지네이션 사이즈가 올바르지 않습니다. (숫자)",
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

  // 404 에러
  if (!goalId || goalId === "0") {
    return new Response(
      JSON.stringify({
        code: "NOT_FOUND_MEMBER",
        message: "유저를 찾을 수 없습니다.",
      }),
      { status: 404 },
    );
  }

  // 200 (성공)
  return new Response(
    JSON.stringify({
      paginationInformation: {
        nextCursor: 0,
        totalCount: 10,
        hasNext: true,
      },
      notes: [
        {
          id: 1,
          title: "자바스크립트 공부 정리 노트",
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
            createdAt: "2025-03-01T22:09:51.983Z",
            updatedAt: "2025-03-01T22:09:51.983Z",
          },
          createdAt: "2025-03-01T22:09:51.983Z",
          updatedAt: "2025-03-01T22:09:51.983Z",
        },
      ],
    }),
    { status: 200 },
  );
};
