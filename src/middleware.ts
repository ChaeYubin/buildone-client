import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { reissueAccessToken } from "./services/auth/token";

export const middleware = async (request: NextRequest) => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("ACCESS_TOKEN")?.value;
  const refreshToken = cookieStore.get("REFRESH_TOKEN")?.value;

  // 액세스 토큰이 있으면 그대로 요청 진행
  if (accessToken) {
    return NextResponse.next();
  }

  // 액세스 토큰이 없고 리프레시 토큰이 있으면 액세스 토큰 재발급 요청 진행
  if (refreshToken) {
    const newAccessToken = await reissueAccessToken();

    const response = newAccessToken
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.url));

    if (newAccessToken) {
      // 재발급 성공 시 쿠키 값 수정
      response.cookies.set("ACCESS_TOKEN", newAccessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
      });
    } else {
      // 재발급 실패 시 accessToken, refreshToken 모두 삭제하고 리다이렉트
      response.cookies.delete("ACCESS_TOKEN");
      response.cookies.delete("REFRESH_TOKEN");
    }

    return response;
  }

  // 둘 다 없으면 로그인 페이지로 리다이렉트
  return NextResponse.redirect(new URL("/login", request.url));
};

export const config = {
  matcher: ["/dashboard/:path*", "/goals/:path*", "/todos/:path*"],
};
