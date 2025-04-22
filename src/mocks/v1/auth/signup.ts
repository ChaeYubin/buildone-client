import { http, HttpResponse } from "msw";

import { SIGNUP_ERROR_CODE } from "@/constants/error";
import { ENDPOINT } from "@/services/endpoint";

import { ACCOUNTS_MOCK_DATA } from "./mock-data";

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export const signup = http.post<never, RequestBody>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.AUTH.SIGNUP}`,
  async ({ request }) => {
    const { name, email, password } = await request.json();

    const account = ACCOUNTS_MOCK_DATA.find((ac) => ac.email === email);

    if (account) {
      return HttpResponse.json(
        {
          code: SIGNUP_ERROR_CODE.ALREADY_EXIST_MEMBER_WITH_DUPLICATED_EMAIL,
          message: "이미 가입된 이메일입니다.",
        },
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

    return HttpResponse.json(
      {
        id: ACCOUNTS_MOCK_DATA.length,
        email,
        name,
      },
      { status: 200 },
    );
  },
);
