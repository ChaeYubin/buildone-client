"use client";

import InactiveIcon from "@/assets/icons-small/checkbox/checkbox_off.svg";
import ActiveIcon from "@/assets/icons-small/checkbox/checkbox_on_reverse.svg";
import { cn } from "@/lib/cn";

interface ChipProps {
  text: string;
  color?: "slate-100" | "slate-900";
  size?: "large" | "small";
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

/**
 * Chip 컴포넌트의 클래스명을 반환하는 함수
 * 색상과 크기에 따라 클래스명을 다르게 설정
 */
const getChipClass = (color: string, size: string) =>
  cn(
    "inline-flex cursor-default items-center gap-2 p-8 rounded-lg",
    color === "slate-100"
      ? "bg-slate-100 text-slate-800"
      : "bg-slate-900 text-white",
    size === "large" ? "text-base" : "text-sm",
  );

// 체크박스 아이콘의 기본 스타일을 반환하는 함수
const getCheckboxClass = () =>
  "h-full aspect-square flex-shrink-0 object-contain";

/**
 * 체크박스 상태를 변경하는 함수
 * onChange 콜백이 제공되었을 경우 실행
 */
const handleCheckboxChange = (
  checked: boolean,
  onChange?: (checked: boolean) => void,
) => {
  if (onChange) {
    onChange(!checked);
  }
};

export default function Chip({
  text,
  color = "slate-100",
  size = "large",
  checked = false,
  onChange,
}: ChipProps) {
  return (
    <div className={getChipClass(color, size)} aria-label={`Chip: ${text}`}>
      <button
        onClick={() => handleCheckboxChange(checked, onChange)}
        aria-label={checked ? "선택됨" : "선택되지 않음"}
      >
        {checked ? (
          <ActiveIcon className={getCheckboxClass()} />
        ) : (
          <InactiveIcon className={getCheckboxClass()} />
        )}
      </button>
      <span className="font-medium">{text}</span>
    </div>
  );
}
