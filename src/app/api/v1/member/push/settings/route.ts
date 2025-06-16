export const GET = async () => {
  return new Response(
    JSON.stringify({
      webPushIsActive: false,
      webPushToken: null,
    }),
    { status: 200 },
  );
};
