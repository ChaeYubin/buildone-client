"use client";

import { RefObject } from "react";

import { useUpdateGoal } from "@/hooks/query/use-goal";

interface GoalTitleProps {
  goalId: string;
  previousTitle: string;
  title: string;
  setTitle: (newTitle: string) => void;
  editing: boolean;
  setEditing: (isEditing: boolean) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function GoalTitle({
  goalId,
  previousTitle,
  title,
  setTitle,
  editing,
  setEditing,
  inputRef,
}: GoalTitleProps) {
  const { mutateAsync } = useUpdateGoal();

  const handleSave = async () => {
    if (inputRef?.current) {
      setEditing(false);

      if (title === previousTitle) {
        return;
      }

      try {
        await mutateAsync({ goalId: Number(goalId), title });
      } catch {
        setTitle(previousTitle);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className="w-full text-base font-semibold md:text-lg">
      {editing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full appearance-none bg-transparent p-0 outline-none"
          ref={inputRef}
          readOnly={!editing}
        />
      ) : (
        <h2>{title}</h2>
      )}
    </div>
  );
}
