import localFont from "next/font/local";

import FcmProvider from "@/lib/fcm-provider";
import ResponsiveToaster from "@/lib/responsive-toaster";
import TanstackQueryProvider from "@/lib/tanstack-query-provider";
import { MockProvider } from "@/mocks/mock-provider";

import type { Metadata } from "next";

import "@/styles/globals.css";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "BuilDone",
  description: "BuilDone에서 목표, 학습, 생산성을 한곳에서 관리하세요!",
  icons: {
    icon: "/image/favicon.ico",
  },
};

if (
  process.env.NEXT_RUNTIME === "nodejs" &&
  process.env.MOCK_ENABLED === "true"
) {
  const { server } = await import("@/mocks/server");

  server.listen({
    onUnhandledRequest: "bypass",
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-pretendard`}>
        <FcmProvider />
        <TanstackQueryProvider>
          <MockProvider>
            <ResponsiveToaster />
            {children}
          </MockProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
