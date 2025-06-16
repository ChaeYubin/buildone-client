"use client";

import { Dispatch, SetStateAction, useState } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import GoalsMenu from "@/components/tab-side-menu/goals-menu";
import { useCreateGoal } from "@/hooks/query/use-goal";
import { cn } from "@/lib/cn";
import { getInfiniteGoalsOptions } from "@/services/dashboard/query";

import AddGoalSection from "./add-goal-section";
import GoalsList from "./goals-list";

interface GoalListContainerProps {
  isTabMinimized: boolean;
  isAdding: boolean;
  setIsAdding: Dispatch<SetStateAction<boolean>>;
}

export default function GoalListContainer({
  isTabMinimized,
  isAdding,
  setIsAdding,
}: GoalListContainerProps) {
  const [newGoal, setNewGoal] = useState("");
  const { mutate } = useCreateGoal();
  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery(
    getInfiniteGoalsOptions({ size: 20 }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim() === "") return;
    mutate({ title: newGoal }, { onSuccess: () => setNewGoal("") });
  };

  return (
    <>
      <GoalsMenu isAdding={isAdding} setIsAdding={setIsAdding} />
      <div className={cn("px-32 md:px-24", isTabMinimized && "z-0")}>
        <GoalsList
          goals={data?.pages}
          hasNextPage={hasNextPage}
          setIsAdding={setIsAdding}
          fetchNextPage={fetchNextPage}
        />
        <AddGoalSection
          goals={data?.pages}
          handleSubmit={handleSubmit}
          isAdding={isAdding}
          newGoal={newGoal}
          setIsAdding={setIsAdding}
          setNewGoal={setNewGoal}
        />
      </div>
    </>
  );
}
