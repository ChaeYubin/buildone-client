import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import NoteCollectionClient from "@/components/note/note-collection-client";
import getQueryClient from "@/lib/get-query-client";
import { getNotesByGoalIdOptions } from "@/services/goal/note/query";
import { getGoalOptions } from "@/services/goal/query";
import "@/styles/note.css";

export default async function NoteCollectionPage({
  params,
}: {
  params: { goalId: string };
}) {
  const goalId = Number(params.goalId);
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchInfiniteQuery(
      getNotesByGoalIdOptions({ goalId, size: 10 }),
    ),
    queryClient.prefetchQuery(getGoalOptions(goalId)),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <NoteCollectionClient goalId={goalId} />
    </HydrationBoundary>
  );
}
