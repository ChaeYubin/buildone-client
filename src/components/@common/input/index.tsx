"use client";

import { forwardRef, InputHTMLAttributes, Ref, useState } from "react";

import VisibilityOffIcon from "@/assets/icons-small/visibility_off.svg";
import VisibilityOnIcon from "@/assets/icons-small/visibility_on.svg";
import { cn } from "@/lib/cn";

export const BASE_CLASS =
  "flex items-center justify-center space-x-8 rounded-xl border border-slate-50 bg-slate-50 px-24 py-12 text-base font-normal focus-within:border-dark-blue-500 hover:border-dark-blue-300";

export const RESPONSIVE_CLASS = "h-44 w-343 md:h-48 md:w-612";

export default forwardRef(function Input(
  {
    id,
    type = "text",
    value,
    onChange,
    className,
    ...props
  }: InputHTMLAttributes<HTMLInputElement>,
  ref?: Ref<HTMLInputElement>,
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn(BASE_CLASS, RESPONSIVE_CLASS, className)}>
      <input
        className="m-0 flex-1 appearance-none border-none bg-transparent p-0 text-slate-800 outline-none placeholder:text-slate-400"
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        id={id}
        value={value}
        onChange={onChange}
        ref={ref}
        {...props}
      />
      {type === "password" && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시하기"}
          aria-pressed={showPassword}
        >
          {showPassword ? <VisibilityOnIcon /> : <VisibilityOffIcon />}
        </button>
      )}
    </div>
  );
});
