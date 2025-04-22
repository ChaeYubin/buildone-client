import { RefObject } from "react";

import { motion } from "motion/react";

import FlagIcon from "@/assets/profile-card/flag.svg";
import HashIcon from "@/assets/profile-card/hash.svg";
import BgIcon from "@/assets/profile-card/profile-card-bg-icon.svg";
import { cn } from "@/lib/cn";
import { ProfileCardInfo } from "@/types/profile";

import BadgeIcon from "../badge/badge-icon";

import LoadingText from "./loading-text";
import TagItem from "./tag-item";

interface ProfileCardContentProps {
  cardRef: RefObject<HTMLDivElement | null>;
  loading: boolean;
  userName: string;
  streakGrade: number;
  data: ProfileCardInfo | undefined;
}

const cardBgColor = [
  "bg-[#8B5E21]",
  "bg-[#C15E08]",
  "bg-[#647B81]",
  "bg-[#9A8004]",
  "bg-[#238C69]",
  "bg-[#4860DD]",
];

const cardHighlightTextColor = [
  "text-[#FCFF72]",
  "text-[#DEF9BBFB]",
  "text-[#B6F2FF]",
  "text-[#FFF3B9]",
  "text-[#FFD177]",
  "text-[#FFC2FD]",
];

export default function ProfileCardContent({
  cardRef,
  loading,
  userName,
  streakGrade,
  data,
}: ProfileCardContentProps) {
  return (
    <div className="relative">
      {loading && (
        <div className="backface-hidden absolute inset-0 z-10 flex items-center justify-center">
          <LoadingText />
        </div>
      )}
      <motion.div
        ref={cardRef}
        className={cn(
          "relative h-424 w-271 rounded-18 border-none px-36 pt-30 text-white md:h-580 md:w-370 md:rounded-24 md:pt-40",
          cardBgColor[streakGrade],
        )}
        animate={{ rotateY: loading ? 180 : 0 }}
        initial={{ rotateY: 180 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {!loading && (
          <div className="backface-hidden absolute inset-0">
            <div className="flex w-full flex-col items-center whitespace-nowrap pt-30 md:pt-40">
              <BadgeIcon level={streakGrade} className="size-36 md:size-48" />
              <h3 className="mt-4 text-26 font-bold md:mt-8 md:text-36">
                {userName}
              </h3>
              <div className="mt-17 flex flex-col items-center gap-y-18 md:mt-24 md:gap-y-24">
                <div className="space-y-8 md:space-y-12">
                  <div className="flex items-center justify-center">
                    <p className="text-14 font-bold md:text-18">
                      <span
                        className={cn(
                          "pr-5 text-24 font-bold md:text-32",
                          cardHighlightTextColor[streakGrade],
                        )}
                      >
                        {data?.streakCount}일
                      </span>
                      째 목표 달성 도전 중
                    </p>
                  </div>
                  <div className="text-center text-xs font-normal leading-normal md:text-base md:leading-6">
                    <p>전체 완료된 목표 수: {data?.completedGoalCount}개</p>
                    <p>
                      하루 평균 할 일 완료 개수:{" "}
                      {data?.dailyAverageCompletedTodoCount}개
                    </p>
                  </div>
                </div>
                <div className="space-y-8 md:space-y-12">
                  <div className="flex -translate-x-10 items-center justify-center gap-x-5 md:gap-x-8">
                    <FlagIcon className="h-19 w-18 md:size-24" />
                    <p className="text-base font-bold md:text-xl">최근 목표</p>
                  </div>
                  <ul className="text-center text-xs font-normal leading-normal md:text-base md:leading-6">
                    {data?.recentGoals.length === 0
                      ? "최근 추가한 목표가 없어요"
                      : data?.recentGoals.map((goal) => (
                          <li key={goal}>· {goal}</li>
                        ))}
                  </ul>
                </div>
                <div className="space-y-8 md:space-y-12">
                  <div className="flex items-center justify-center gap-x-4 md:gap-x-8">
                    <HashIcon className="size-18 md:size-24" />
                    <p className="text-base font-bold md:text-xl">
                      많이 사용하는 태그
                    </p>
                  </div>
                  <ul className="flex justify-center gap-x-6 md:gap-x-8">
                    {data?.mostlyNoteTags.length === 0
                      ? "사용한 태그가 없어요"
                      : data?.mostlyNoteTags.map((tag) => (
                          <TagItem tag={tag} key={tag} />
                        ))}
                  </ul>
                  <div className="text-center text-xs font-normal md:text-base" />
                </div>
              </div>
            </div>
            <BgIcon className="absolute bottom-0 left-0 h-153 w-98 rounded-bl-18 md:h-209 md:w-134 md:rounded-bl-24" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
