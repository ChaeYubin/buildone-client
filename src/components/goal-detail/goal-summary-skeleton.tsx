"use client";

import FlagGoalIcon from "@/assets/icons-big/flag_goal.svg";

import ProgressBar from "../@common/progress-bar";
import Skeleton from "../@common/skeleton";

import GoalSummaryDropdown from "./goal-summary-dropdown";

export default function GoalSummarySkeleton() {
  return (
    <div className="mt-0 rounded-12 border border-slate-100 bg-white px-24 py-16 md:mt-16">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center gap-x-8">
          <FlagGoalIcon className="flex-none" />
          <Skeleton className="h-28 w-200" />
        </div>
        <GoalSummaryDropdown goalId="0" setTitleEditing={() => false} />
      </div>
      <div className="mt-24">
        <p className="mb-8 text-xs font-semibold">Progress</p>
        <ProgressBar current={0} total={100} border={false} />
      </div>
    </div>
  );
}
