"use client";

import { ChangeEvent, KeyboardEvent, useState } from "react";

import DeleteIcon from "@/assets/icons-small/delete_slate_400.svg";

export type Tag = {
  id: string;
  text: string;
};

interface TagInputProps {
  tags: Tag[];
  setTags: (tags: Tag[]) => void;
}

export default function TagInput({ tags, setTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const createNewTag = (text: string): Tag => ({
    id: text, // 텍스트 자체를 key로 사용
    text,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === " " || e.key === "Enter") && inputValue.trim() !== "") {
      e.preventDefault();
      const newTagText = inputValue.trim();
      // 중복 체크: 이미 같은 텍스트가 있는 경우
      const isDuplicate = tags.some((tag) => tag.text === newTagText);
      if (isDuplicate) {
        setInputValue(""); // 중복된 태그 입력 시, 태그 생성 x
        return;
      }
      const newTag = createNewTag(newTagText);
      setTags([...tags, newTag]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (id: string) => {
    setTags(tags.filter((tag) => tag.id !== id));
  };

  return (
    <div className="flex flex-wrap gap-4 border-b py-8">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="inline-flex h-24 w-fit items-center whitespace-nowrap rounded-100 border border-dark-blue-300 bg-dark-blue-100 px-8 py-2"
        >
          <span className="text-sm font-normal">{tag.text}</span>
          <button
            className="ml-4 flex h-16 w-16 items-center justify-center"
            type="button"
            onClick={() => handleRemoveTag(tag.id)}
          >
            <DeleteIcon aria-label="태그 삭제" />
          </button>
        </div>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length > 0 ? "" : "태그를 입력하세요."}
        aria-label="태그 입력"
        className="flex-grow text-base font-normal text-slate-700 outline-none"
      />
    </div>
  );
}
