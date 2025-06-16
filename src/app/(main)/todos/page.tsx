import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import LoadingSpinner from "@/components/@common/loading-spinner";
import AllListTodo from "@/components/todo/all-list-todo";
import getQueryClient from "@/lib/get-query-client";
import { getInfiniteTodosByGoalIdOptions } from "@/services/todo/query";

export const dynamic = "force-dynamic";

export default async function TodosPage() {
  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery(
    getInfiniteTodosByGoalIdOptions({ size: 40 }),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="w-full px-16 max-lg:mx-auto md:px-24 lg:ml-80 lg:max-w-792 lg:px-0">
          <AllListTodo />
        </div>
      </Suspense>
    </HydrationBoundary>
  );
}
