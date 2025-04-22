import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import FileIcon from "@/assets/icons-small/file.svg";
import LinkIcon from "@/assets/icons-small/link.svg";
import NoteIcon from "@/assets/icons-small/note.svg";
import TodoTitleAndCheckBox from "@/components/todo/todo-title-checkbox";
import useInView from "@/hooks/use-in-view";
import { cn } from "@/lib/cn";
import { getNote } from "@/services/note";
import { NoteResponse } from "@/types/note";
import { TodoResponse } from "@/types/todo";

import FixedDropdown from "../@common/dropdown/fixed-dropdown";
import Sheet from "../@common/portal/sheet";
import DetailSheet from "../note/detail-sheet";
import TodoModal from "../todo-modal/todo-modal";

import Goal from "./goal";
import TodoDeletePopup from "./todo-delete-popup";

interface Props {
  todo: TodoResponse;
  showGoal?: boolean;
}
interface DropdownItem {
  id: string;
  label: string;
  onClick: () => void;
}

export default function Todo({ todo, showGoal }: Props) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [ref, isInView] = useInView();
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  const { data: note } = useQuery<NoteResponse, Error>({
    queryKey: ["noteDetail", selectedNoteId],
    queryFn: () => getNote(selectedNoteId as number),
    enabled: selectedNoteId !== null,
  });

  const getDropdownItems = (selectedTodoItem: TodoResponse): DropdownItem[] => {
    const baseItems: DropdownItem[] = [
      {
        id: "edit",
        label: "수정하기",
        onClick: () => {
          setIsEditModalOpen(true);
        },
      },
      {
        id: "delete",
        label: "삭제하기",
        onClick: () => setIsDeletePopupOpen(true),
      },
    ];

    if (selectedTodoItem.noteId !== null) {
      return [
        {
          id: "note",
          label: "노트보기",
          onClick: () => {
            if (selectedTodoItem.noteId !== null) {
              setSelectedNoteId(selectedTodoItem.noteId);
              setSheetOpen(true);
            }
          },
        },
        ...baseItems,
      ];
    }

    return baseItems;
  };

  const iconSpread = (currentTodo: TodoResponse) => {
    const icons = [
      { key: "file", url: currentTodo.fileUrl, Icon: FileIcon },
      { key: "link", url: currentTodo.linkUrl, Icon: LinkIcon },
      {
        key: "note",
        url: null,
        Icon: NoteIcon,
        onClick:
          currentTodo.noteId !== null
            ? () => {
                setSelectedNoteId(currentTodo.noteId);
                setSheetOpen(true);
              }
            : undefined,
      },
    ];

    return icons
      .filter(({ url, onClick }) => url !== null || onClick)
      .map(({ key, url, Icon, onClick }) =>
        url ? (
          <Link
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${key} 열기`}
            className="ml-5 hover:drop-shadow"
          >
            <Icon />
          </Link>
        ) : (
          <button
            key={key}
            onClick={onClick}
            disabled={!onClick}
            aria-label={`${key} 열기`}
            className="ml-5 hover:drop-shadow"
          >
            <Icon />
          </button>
        ),
      );
  };

  return (
    <>
      <li
        ref={ref}
        aria-label={`할일: ${todo.title}, ${todo.isDone ? "완료됨" : "미완료"}`}
        className={cn(
          "group flex flex-col text-slate-800 transition-opacity duration-500",
          `${isInView ? "animate-fadeIn opacity-100" : "animate-fadeOut opacity-0"}`,
        )}
      >
        <div className="flex items-center justify-between">
          <TodoTitleAndCheckBox todo={todo} />
          <div
            role="group"
            aria-label="할일 관련 작업"
            className="flex text-slate-700"
          >
            {iconSpread(todo)}
            <FixedDropdown
              items={getDropdownItems(todo)}
              todoId={todo.id}
              noteId={todo.noteId}
            />
          </div>
        </div>
        {showGoal && (
          <div>
            <Goal todo={todo} />
          </div>
        )}
      </li>
      {sheetOpen && todo.noteId !== null && note !== undefined && (
        <Sheet.Root
          open={sheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) setSelectedNoteId(null);
          }}
        >
          <DetailSheet noteId={todo.noteId} linkUrl={note?.linkUrl} />
        </Sheet.Root>
      )}
      {isEditModalOpen && (
        <TodoModal
          goalId={todo.goalInformation?.id}
          todo={todo}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
        />
      )}
      {isDeletePopupOpen && (
        <TodoDeletePopup
          todoId={todo.id}
          todoTitle={todo.title}
          isDeletePopupOpen={isDeletePopupOpen}
          setIsDeletePopupOpen={setIsDeletePopupOpen}
          goalId={todo.goalInformation?.id}
        />
      )}
    </>
  );
}
