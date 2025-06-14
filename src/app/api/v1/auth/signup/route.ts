import { SIGNUP_ERROR_CODE } from "@/constants/error";

import { ACCOUNTS_MOCK_DATA } from "../mock-data";

export const POST = async (request: Request) => {
  const { name, email, password } = await request.json();

  const account = ACCOUNTS_MOCK_DATA.find((ac) => ac.email === email);

  if (account) {
    return new Response(
      JSON.stringify({
        code: SIGNUP_ERROR_CODE.ALREADY_EXIST_MEMBER_WITH_DUPLICATED_EMAIL,
        message: "이미 가입된 이메일입니다.",
      }),
      {
        status: 400,
      },
    );
  }

  ACCOUNTS_MOCK_DATA.push({
    id: ACCOUNTS_MOCK_DATA.length + 1,
    name,
    email,
    password,
    streakGrade: 0,
  });

  return new Response(
    JSON.stringify({
      id: ACCOUNTS_MOCK_DATA.length,
      email,
      name,
    }),
    { status: 200 },
  );
};
