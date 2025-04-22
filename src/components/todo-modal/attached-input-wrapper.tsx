import React, { useState } from "react";

import CheckboxOff from "@/assets/icons-small/checkbox/checkbox_off.svg";
import CheckboxOnReverse from "@/assets/icons-small/checkbox/checkbox_on_reverse.svg";
import { cn } from "@/lib/cn";

import Label from "../@common/label";

import FileInput from "./file-input";
import LinkInput from "./link-input";
import { SelectOptionType } from "./todo-form-provider";

export default function AttachedInputWrapper() {
  const [selectOption, setSelectOption] = useState<SelectOptionType>("link");

  const handleChangeOption = (value: SelectOptionType) => {
    setSelectOption(value);
  };

  return (
    <div className="space-y-12">
      <Label label="자료" />
      <ul className="flex gap-8">
        <li>
          <button
            onClick={() => handleChangeOption("link")}
            className={cn(
              "flex h-40 items-center justify-center gap-3 rounded-8 bg-slate-100 px-12 font-medium text-slate-800",
              selectOption === "link" && "bg-slate-900 text-white",
            )}
            type="button"
          >
            {selectOption === "link" ? <CheckboxOnReverse /> : <CheckboxOff />}
            링크 첨부
          </button>
        </li>
        <li title="현재 지원하지 않는 기능입니다.">
          <button
            disabled
            onClick={() => handleChangeOption("file")}
            className={cn(
              "flex h-40 items-center justify-center gap-3 rounded-8 bg-slate-100 px-12 font-medium text-slate-800 opacity-70",
              selectOption === "file" && "bg-slate-900 text-white",
            )}
            type="button"
          >
            {selectOption === "file" ? <CheckboxOnReverse /> : <CheckboxOff />}
            파일 업로드
          </button>
        </li>
      </ul>
      <FileInput id="file" selectOption={selectOption} />
      <LinkInput id="link" selectOption={selectOption} />
    </div>
  );
}
