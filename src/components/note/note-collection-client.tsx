"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import FlagGoalSmall from "@/assets/icons-big/flag_goal_small.svg";
import Card from "@/components/note/card";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { getNotesByGoalIdOptions } from "@/services/goal/note/query";
import { getGoalOptions } from "@/services/goal/query";

import "@/styles/note.css";

interface NoteCollectionClientProps {
  goalId: number;
}

export default function NoteCollectionClient({
  goalId,
}: NoteCollectionClientProps) {
  const {
    data: notesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(getNotesByGoalIdOptions({ goalId, size: 10 }));

  const { data: goalData } = useSuspenseQuery(getGoalOptions(goalId));

  const goalTitle = goalData?.title || "노트 모아보기";

  const { ref } = useInfiniteScroll({
    threshold: 0.1,
    hasNextPage,
    fetchNextPage,
  });

  const notes = notesData?.pages?.flatMap((page) => page?.notes ?? []) ?? [];

  return (
    <div className="container-width mt-24">
      <div className="mb-16 hidden text-lg font-semibold md:block">
        노트 모아보기
      </div>
      <div className="flex h-52 items-center rounded-12 bg-white pb-14 pl-24 pr-24 pt-14">
        <FlagGoalSmall className="h-24 w-24" />
        <span className="ml-8 text-sm font-semibold">{goalTitle}</span>
      </div>
      {notes.length > 0 ? (
        <>
          {notesData?.pages.map((page, pageIndex) => {
            const pageKey =
              page.notes.length > 0 ? page.notes[0].id : `page-${pageIndex}`;
            return (
              <div key={pageKey}>
                {page.notes.map((note) => (
                  <Card key={note.id} note={note} />
                ))}
              </div>
            );
          })}
          {hasNextPage && <div ref={ref} className="h-1" />}
          {isFetchingNextPage && <div>Loading more...</div>}
        </>
      ) : (
        <div className="flex min-h-[calc(100vh-300px)] w-full items-center justify-center">
          <p className="text-center text-sm font-normal text-slate-500">
            아직 등록된 노트가 없어요
          </p>
        </div>
      )}
    </div>
  );
}
