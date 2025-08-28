import localFont from "next/font/local";

import ProjectNotice from "@/components/project-notice";
import ResponsiveToaster from "@/lib/responsive-toaster";
import TanstackQueryProvider from "@/lib/tanstack-query-provider";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} font-pretendard`}>
        {/* <FcmProvider /> */}
        <TanstackQueryProvider>
          <ResponsiveToaster />
          <ProjectNotice />
          {children}
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
