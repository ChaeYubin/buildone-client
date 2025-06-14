import { LOGIN_ERROR_CODE } from "@/constants/error";

import { ACCOUNTS_MOCK_DATA } from "../mock-data";

export const POST = async (request: Request) => {
  const { email, password } = await request.json();

  const account = ACCOUNTS_MOCK_DATA.find((ac) => ac.email === email);

  if (account) {
    if (account.password !== password) {
      return new Response(
        JSON.stringify({
          code: LOGIN_ERROR_CODE.INVALID_PASSWORD_FORMAT,
          message: "비밀번호가 올바르지 않습니다.",
        }),
        { status: 400 },
      );
    }

    return new Response(
      JSON.stringify({
        memberInformation: {
          id: account.id,
          email,
          name: account.name,
          streakGrade: account.streakGrade,
        },
        credentials: {
          accessToken: "ACCESS_TOKEN",
          refreshToken: "REFRESH_TOKEN",
        },
      }),
    );
  }

  return new Response(
    JSON.stringify({
      code: LOGIN_ERROR_CODE.NOT_FOUND_MEMBER_WITH_EMAIL,
      message: "해당 이메일로 가입된 사용자가 없습니다.",
    }),
    { status: 400 },
  );
};
