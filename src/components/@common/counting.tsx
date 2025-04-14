"use client";

import { cn } from "@/lib/cn";

interface CountingProps {
  type: "title" | "text";
  count: number;
  total: number;
}

const BASE_CLASS = "items-center justify-center rounded-lg text-xs font-medium";
const TITLE_CLASS = "h-5 bg-white-50 px-1 text-slate-800";
const TEXT_CLASS = "text-slate-800";

export default function Counting({ type, count, total }: CountingProps) {
  if (type === "title") {
    return (
      <div
        className={cn(BASE_CLASS, TITLE_CLASS)}
        role="status"
        aria-label={`현재 ${count}자, 최대 ${total}자`}
      >
        {count}/<span className="text-dark-blue-500">{total}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(BASE_CLASS, TEXT_CLASS)}
      role="status"
      aria-label={`공백 포함 ${total}자, 공백 제외 ${count}자`}
    >
      공백포함 : 총 {total}자 | 공백제외 : 총 {count}자
    </div>
  );
}
