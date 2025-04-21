import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import GoalSummary from "@/components/goal-detail/goal-summary";
import RouteButtonToNotes from "@/components/goal-detail/route-button-to-notes";
import TodoList from "@/components/goal-detail/todo-list";
import getQueryClient from "@/lib/get-query-client";
import {
  getGoalOptions,
  getProgressByGoalIdOptions,
} from "@/services/goal/query";
import { getInfiniteTodosByGoalIdOptions } from "@/services/todo/query";

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = await params;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getGoalOptions(Number(goalId))),
    queryClient.prefetchQuery(getProgressByGoalIdOptions(Number(goalId))),
    queryClient.prefetchInfiniteQuery(
      getInfiniteTodosByGoalIdOptions({
        goalId: Number(goalId),
        done: true,
      }),
    ),
    queryClient.prefetchInfiniteQuery(
      getInfiniteTodosByGoalIdOptions({
        goalId: Number(goalId),
        done: false,
      }),
    ),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="px-16 py-16 max-lg:mx-auto md:px-24 md:py-24 lg:mx-80 lg:max-w-1200 lg:px-0">
        <h1 className="hidden text-lg font-semibold md:block">목표</h1>
        <div className="flex flex-col gap-16 md:gap-24">
          <GoalSummary goalId={goalId} />
          <RouteButtonToNotes goalId={goalId} />
          <div className="flex flex-col gap-16 md:gap-24 lg:flex-row lg:items-start">
            <TodoList goalId={goalId} done={false} />
            <TodoList goalId={goalId} done />
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
