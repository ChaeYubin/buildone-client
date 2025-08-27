import { NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY } from "@/constants/cookie";

export const POST = async (request: Request) => {
  const { accessToken } = await request.json();

  const response = NextResponse.json({}, { status: 200 });

  response.cookies.set(ACCESS_TOKEN_KEY, accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  return response;
};
