"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useParams, useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/@common/button";
import Counting from "@/components/@common/counting";
import EmbeddedFrame from "@/components/@common/embeded-frame";
import Goal from "@/components/note/goal";
import LinkAttached from "@/components/note/link-attached";
import LoadNoteModal from "@/components/note/load-modal";
import LoadNoteToastManager, {
  NoteData,
} from "@/components/note/load-note-toast-manager";
import TagInput, { Tag } from "@/components/note/tag";
import TempSaveManager, {
  TempSaveManagerRef,
} from "@/components/note/temp-save-manager";
import Tiptap from "@/components/note/tiptap";
import Todo from "@/components/note/todo";
import { useCreateOrUpdateNote, useNoteDetail } from "@/hooks/query/use-notes";
import "@/styles/note.css";
// 단일 Todo 상세 정보를 가져오는 API 함수
import { useTodoDetail } from "@/hooks/query/use-todo";
import { cn } from "@/lib/cn";
import { dashboardKeys } from "@/services/query-key";
import { successToast } from "@/utils/custom-toast";
import { countWithoutSpaces, countWithSpaces } from "@/utils/text-utils";

export default function NotesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteIdParam = searchParams.get("noteId");

  // noteId가 있으면 수정모드, 없으면 새로 작성하는 모드
  const noteId = noteIdParam ? Number(noteIdParam) : null;

  // [todoId]는 라우트 동적 세그먼트에서 추출
  const params = useParams<{ todoId: string }>();
  const todoId = Number(params.todoId);

  const isEditMode = noteId !== null;

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [showLink, setShowLink] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [loadedNote, setLoadedNote] = useState<NoteData | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const tempSaveManagerRef = useRef<TempSaveManagerRef>(null);

  // 수정 모드에서는 noteData를 불러옴.
  const { data: noteData, isLoading: noteLoading } = useNoteDetail(noteId!);

  // 새 노트 작성 시(todoId가 있을 때) todo 상세 정보를 조회함.
  const { data: todoData, isLoading: todoLoading } = useTodoDetail(
    todoId,
    isEditMode,
  );

  // 수정 모드일 경우 noteData를 기반으로 초기화
  useEffect(() => {
    if (noteData) {
      setTitle(noteData.title);
      setContent(noteData.content);
      if (noteData.linkUrl && noteData.linkUrl.trim() !== "") {
        setLink(noteData.linkUrl);
        setShowLink(true);
      } else {
        setLink("");
        setShowLink(false);
      }
      if (noteData.tags && noteData.tags.length > 0) {
        setTags(
          noteData.tags.map((t: string, index: number) => ({
            id: `${t}-${index}`,
            text: t,
          })),
        );
      } else {
        setTags([]);
      }
    }
  }, [noteData]);

  const mutation = useCreateOrUpdateNote({
    noteId,
    todoId,
    isEditMode,
  });

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length <= 30) {
      setTitle(newTitle);
    }
  };

  const handleRemoveLink = () => {
    setShowLink(false);
    setLink("");
  };

  const handleAddLink = (newLink: string) => {
    setLink(newLink);
    setShowLink(true);
  };

  // 로컬 스토리지에서 불러온 데이터를 toast에서 받은 경우, 모달을 연다.
  const handleOpenLoadModal = (data: NoteData) => {
    setLoadedNote(data);
    setModalOpen(true);
  };

  // 모달에서 "불러오기" 버튼 클릭 시 실행
  const handleLoadNote = (data: NoteData) => {
    setTitle(data.title);
    setContent(data.content);
    if (data.link && data.link.trim() !== "") {
      setLink(data.link);
      setShowLink(true);
    } else {
      setLink("");
      setShowLink(false);
    }
    setModalOpen(false);
  };

  // "임시저장" 버튼 클릭 시 TempSaveManager의 저장 함수 호출
  const handleTempSave = () => {
    tempSaveManagerRef.current?.saveTempNote();
  };

  const handleSubmit = () => {
    mutation.mutate(
      {
        title,
        content,
        linkUrl: link,
        tags: tags.map((tag) => tag.text),
      },
      {
        onSuccess: (data) => {
          const goalId = data.goalInformation?.id;
          if (goalId) {
            router.push(`/goals/${goalId}/notes`);
          } else {
            router.push("/dashboard");
            dashboardKeys.recent();
          }

          if (noteId) {
            successToast("note-modified", "노트가 수정되었습니다.");
          } else {
            successToast("note-created", "노트가 생성되었습니다.");
          }
        },
      },
    );
  };

  if ((isEditMode && noteLoading) || (!isEditMode && todoLoading))
    return <div />;

  // 수정 모드이면 noteData의 정보를 사용, 그렇지 않으면 todoData의 정보를 사용
  const displayedTodoTitle = isEditMode
    ? noteData?.todoInformation?.title
    : todoData?.title;
  const displayedGoalTitle = (isEditMode ? noteData : todoData)?.goalInformation
    ?.title;

  return (
    <div className="relative h-full bg-white">
      {sheetOpen && link && <EmbeddedFrame linkUrl={link} fixed />}
      <div
        className={cn(
          "container-width",
          sheetOpen ? "absolute right-0 h-full pt-24" : "h-full pt-24",
        )}
      >
        {/* 헤더 */}
        <div className="grid h-44 grid-cols-[162px_auto] items-center">
          <h1 className="truncate font-semibold text-slate-900 md:text-lg">
            노트 작성
          </h1>
          <div className="flex justify-end gap-8">
            <Button
              variant="outlined"
              size="sm"
              shape="square"
              className="border-0"
              onClick={handleTempSave}
            >
              임시저장
            </Button>
            <Button
              variant="solid"
              size="sm"
              shape="square"
              disabled={!title.trim() || !content.trim()}
              onClick={handleSubmit}
            >
              {noteId ? "수정하기" : "작성 완료"}
            </Button>
          </div>
        </div>

        <div className="mt-16">
          {/* 임시 저장 노트 로드 토스트 */}
          <LoadNoteToastManager onLoadNote={handleOpenLoadModal} />

          {/* 목표 표시 */}
          {displayedGoalTitle ? <Goal goalText={displayedGoalTitle} /> : null}

          {/* To do 항목 */}
          <Todo todoText={displayedTodoTitle || ""} />

          {/* 노트 제목 입력 */}
          <div className="flex items-center gap-8 border-b border-t border-slate-200">
            <input
              type="text"
              className="h-52 w-full text-lg placeholder:text-lg focus:outline-none"
              placeholder="노트의 제목을 입력해주세요"
              value={title}
              onChange={handleTitleChange}
            />
            <Counting type="title" count={title.length} total={30} />
          </div>

          {/* 태그 입력 영역 */}
          <TagInput tags={tags} setTags={setTags} />

          {/* 에디터 영역 */}
          <div className="mt-16">
            <Counting
              type="text"
              count={countWithoutSpaces(content)}
              total={countWithSpaces(content)}
            />

            {/* 링크 첨부 */}
            {showLink && (
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSheetOpen(!sheetOpen);
                  }
                }}
                onClick={() => setSheetOpen(!sheetOpen)}
              >
                <LinkAttached
                  link={link}
                  onRemove={handleRemoveLink}
                  setSheetOpen={setSheetOpen}
                />
              </div>
            )}

            {/* 본문 */}
            <div className="mt-8">
              <Tiptap
                content={content}
                setContents={setContent}
                onLinkSubmit={handleAddLink}
              />
            </div>
          </div>
          <TempSaveManager
            ref={tempSaveManagerRef}
            title={title}
            content={content}
            link={showLink ? link : ""}
          />
        </div>
      </div>

      {/* 모달 */}
      {loadedNote && (
        <LoadNoteModal
          open={modalOpen}
          setOpen={setModalOpen}
          storedTitle={
            loadedNote.title && loadedNote.title.trim() !== ""
              ? loadedNote.title
              : "제목 없음"
          }
          onLoad={() => handleLoadNote(loadedNote)}
        />
      )}
    </div>
  );
}
