"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Dropdown from "@/components/@common/dropdown/dropdown";
import Modal from "@/components/@common/portal/modal";
import Sheet from "@/components/@common/portal/sheet";
import DetailSheet from "@/components/note/detail-sheet";
import { useDeleteNote, useNoteDetail } from "@/hooks/query/use-notes";
import { NoteResponse } from "@/types/note";

interface NoteCardProps {
  note: NoteResponse;
}

export default function NoteCard({ note }: NoteCardProps) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { mutate: deleteNote } = useDeleteNote();

  const { data: detailedNote } = useNoteDetail(note.id);

  return (
    <Modal.Root open={modalOpen} onOpenChange={setModalOpen}>
      <div className="mt-16 min-h-164 w-full rounded-12 bg-white p-24">
        <div className="flex h-44 justify-between">
          <div className="flex h-24 w-45 items-center justify-center rounded-16 border border-dark-blue-300 bg-dark-blue-100 px-3 py-2 text-xs font-medium">
            To do
          </div>
          <Dropdown
            items={[
              {
                label: "수정하기",
                onClick: (): void =>
                  router.push(`/todos/9/note/write?noteId=${note.id}`),
              },
              { label: "삭제하기", onClick: (): void => setModalOpen(true) },
            ]}
          />
        </div>

        <Sheet.Root open={sheetOpen} onOpenChange={setSheetOpen}>
          <DetailSheet noteId={note.id} linkUrl={detailedNote?.linkUrl} />
          <Sheet.Trigger className="h-40 w-full border-b border-b-slate-200 text-left font-medium">
            {note.title}
          </Sheet.Trigger>
        </Sheet.Root>

        {/* 태그와 todo */}
        <div className="mt-12 flex flex-wrap gap-8 text-xs text-slate-700">
          {(detailedNote?.tags || []).map((tag) => (
            <span
              key={tag}
              className="truncate rounded-4 bg-slate-100 px-3 py-2 font-medium"
            >
              #{tag}
            </span>
          ))}
          <span className="truncate py-2 pr-3 font-normal">
            {note.todoInformation.title}
          </span>
        </div>

        {/* 모달 */}
        <Modal.Content
          hasCloseIcon={false}
          className="h-216 w-300 rounded-lg md:w-450"
        >
          <div className="text-center text-base font-medium text-slate-800">
            노트를 삭제하시겠어요?
            <br />
            삭제된 노트는 복구할 수 없습니다.
          </div>
          <Modal.Footer>
            <Modal.Close variant="outlined" className="w-120 min-w-120">
              취소
            </Modal.Close>
            <Modal.Close
              variant="solid"
              className="w-120 min-w-120"
              onClick={(): void => deleteNote(note.id)}
            >
              삭제
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </div>
    </Modal.Root>
  );
}
