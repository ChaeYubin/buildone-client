import { cookies } from "next/headers";

export const POST = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh-token")?.value;

  if (refreshToken) {
    return new Response(
      JSON.stringify({
        accessToken: "ACCESS_TOKEN_IN_HEADER",
        refreshToken: "REFRESH_TOKEN_IN_COOKIE",
      }),
      {
        status: 200,
        headers: {
          "Access-Token": "re-access_token_abcd_64",
          "Access-Token-Expired-Time": "2025-02-20T02:24:18.954Z",
        },
      },
    );
  }

  return new Response(
    JSON.stringify({
      code: "EMPTY_REFRESH_TOKEN",
      message: "권한이 없습니다.",
    }),
    {
      status: 401,
    },
  );
};
