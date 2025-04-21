import { http, HttpResponse } from "msw";

import { LOGIN_ERROR_CODE } from "@/constants/error";
import { ENDPOINT } from "@/services/endpoint";

interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
  streakGrade: number;
}

export const ACCOUNTS_MOCK_DATA: Account[] = [
  {
    id: 0,
    email: "test@test.com",
    password: "Test1234!@#$",
    name: "테스트 계정",
    streakGrade: 0,
  },
];

export const TEST_ACCOUNT = ACCOUNTS_MOCK_DATA[0];

interface RequestBody {
  email: string;
  password: string;
}

export const login = http.post<never, RequestBody>(
  `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}${ENDPOINT.AUTH.LOGIN}`,
  async ({ request }) => {
    const { email, password } = await request.json();

    const account = ACCOUNTS_MOCK_DATA.find((ac) => ac.email === email);

    if (account) {
      if (account.password !== password) {
        return HttpResponse.json(
          {
            code: LOGIN_ERROR_CODE.INVALID_PASSWORD_FORMAT,
            message: "비밀번호가 올바르지 않습니다.",
          },
          { status: 400 },
        );
      }

      return HttpResponse.json({
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
      });
    }

    return HttpResponse.json(
      {
        code: LOGIN_ERROR_CODE.NOT_FOUND_MEMBER_WITH_EMAIL,
        message: "해당 이메일로 가입된 사용자가 없습니다.",
      },
      { status: 400 },
    );
  },
);
