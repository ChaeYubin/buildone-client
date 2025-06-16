import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import LoadingSpinner from "@/components/@common/loading-spinner";
import NoteCollectionClient from "@/components/note/note-collection-client";
import getQueryClient from "@/lib/get-query-client";
import { getNotesByGoalIdOptions } from "@/services/goal/note/query";
import { getGoalOptions } from "@/services/goal/query";

import "@/styles/note.css";

export default async function NoteCollectionPage({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = await params;
  const goalIdNumber = Number(goalId);

  const queryClient = getQueryClient();

  queryClient.prefetchInfiniteQuery(
    getNotesByGoalIdOptions({ goalId: goalIdNumber, size: 10 }),
  );
  queryClient.prefetchQuery(getGoalOptions(goalIdNumber));

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <NoteCollectionClient goalId={goalIdNumber} />
      </Suspense>
    </HydrationBoundary>
  );
}
