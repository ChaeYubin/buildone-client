import { Dispatch, SetStateAction } from "react";

import DeleteIcon from "@/assets/icons-small/delete.svg";
import EmbedIcon from "@/assets/icons-small/embed.svg";
import { cn } from "@/lib/cn";
import "@/styles/note.css";

interface LinkAttachedProps {
  link: string;
  onRemove?: () => void;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  setSheetOpen?: Dispatch<SetStateAction<boolean>>;
}

export default function LinkAttached({
  link,
  onRemove,
  onClick,
  setSheetOpen,
}: LinkAttachedProps) {
  const handleLinkRemoveButtonClick = () => {
    if (onRemove) onRemove();
    if (setSheetOpen) setSheetOpen(false);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
        }
      }}
      className={cn(
        "flex !w-full items-center justify-between rounded-20 bg-slate-200 px-6 py-4",
        "mb-8 mt-12 h-32 cursor-pointer",
      )}
    >
      <EmbedIcon className="mr-8 flex-shrink-0" width="24" height="24" />
      <span
        className={cn(
          "w-full flex-grow truncate text-start text-slate-800",
          "flex-shrink",
        )}
      >
        {link}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleLinkRemoveButtonClick();
          }}
          className="flex-shrink-0"
        >
          <DeleteIcon width="24" height="24" />
        </button>
      )}
    </div>
  );
}
