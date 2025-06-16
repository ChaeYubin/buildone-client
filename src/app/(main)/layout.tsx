import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import TabSideMenuContainer from "@/components/tab-side-menu/tab-side-menu-container";
import getQueryClient from "@/lib/get-query-client";
import { getInfiniteGoalsOptions } from "@/services/dashboard/query";
import { getPushNotificationSettingOptions } from "@/services/push-notification/query";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery(getInfiniteGoalsOptions({ size: 20 }));
  queryClient.prefetchQuery(getPushNotificationSettingOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-screen bg-slate-100">
        <nav>
          <TabSideMenuContainer />
        </nav>
        <main className="w-full pt-48 md:pl-60 md:pt-0 lg:pl-280">
          {children}
        </main>
      </div>
    </HydrationBoundary>
  );
}
