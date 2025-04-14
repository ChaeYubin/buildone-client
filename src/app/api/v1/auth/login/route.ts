import { cookies } from "next/headers";

import { LOGIN_ERROR_CODE } from "@/constants/error";

import { users } from "../mock";

// refresh-token 재발급 테스트를 위한 변수
let count = 0;

export const POST = async (request: Request) => {
  const { email, password } = await request.json();

  // access-token 재발급 테스트를 위한 입력값
  if (email === "asdf@asdf.com") {
    if (count === 0) {
      count += 1;

      return new Response(
        JSON.stringify({
          code: "INVALID_TOKEN",
          message: "권한이 없습니다.",
        }),
        { status: 401 },
      );
    }

    return new Response(
      JSON.stringify({
        memberInformation: {
          id: 1,
          email: "test@test.com",
          name: "김경식",
        },
        credentials: {
          accessToken: "ACCESS_TOKEN_IN_HEADER",
          refreshToken: "REFRESH_TOKEN_IN_COOKIE",
        },
      }),
      {
        status: 200,
        headers: {
          "Access-Token": "access_token_abcd_64",
          "Access-Token-Expired-Time": "2025-02-01T02:24:18.954Z",
        },
      },
    );
  }

  // 로그인이 성공한 경우
  if (email === "test@test.com" && password === "1234") {
    const cookieStore = await cookies();
    cookieStore.set("refresh-token", "refresh-token");

    return new Response(
      JSON.stringify({
        memberInformation: {
          id: 1,
          email: "test@test.com",
          name: "김경식",
        },
        credentials: {
          accessToken: "ACCESS_TOKEN_IN_HEADER",
          refreshToken: "REFRESH_TOKEN_IN_COOKIE",
        },
      }),
      {
        status: 200,
        headers: {
          "Access-Token": "access_token_abcd_64",
          "Access-Token-Expired-Time": "2025-02-01T02:24:18.954Z",
        },
      },
    );
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const cookieStore = await cookies();
    cookieStore.set("refresh-token", "refresh-token");

    return new Response(
      JSON.stringify({
        memberInformation: {
          id: user.id,
          email,
          name: user.name,
        },
        credentials: {
          accessToken: "ACCESS_TOKEN_IN_HEADER",
          refreshToken: "REFRESH_TOKEN_IN_COOKIE",
        },
      }),
      {
        status: 200,
        headers: {
          "Access-Token": "access_token_abcd_64",
          "Access-Token-Expired-Time": "2025-02-01T02:24:18.954Z",
        },
      },
    );
  }

  // 비밀번호가 올바르지 않은 경우
  if (email === "test@test.com") {
    return new Response(
      JSON.stringify({
        code: LOGIN_ERROR_CODE.INVALID_PASSWORD_FORMAT,
        message: "비밀번호가 올바르지 않습니다.",
      }),
      {
        status: 400,
      },
    );
  }

  // 존재하지 않는 회원인 경우
  return new Response(
    JSON.stringify({
      code: LOGIN_ERROR_CODE.NOT_FOUND_MEMBER_WITH_EMAIL,
      message: "가입되지 않은 이메일입니다.",
    }),
    {
      status: 404,
    },
  );
};
