"use client";

import { useState } from "react";

import { useQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";

import PlusIcon from "@/assets/icons-small/plus/plus_db_sm.svg";
import Todo from "@/components/todo/todo";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { cn } from "@/lib/cn";
import { todoKeys } from "@/services/query-key";
import { getTodosLengths } from "@/services/todo";
import { getInfiniteTodosByGoalIdOptions } from "@/services/todo/query";

import Filter from "../@common/filter";
import TodoModal from "../todo-modal/todo-modal";

export interface TodoLengths {
  AllCount: number;
  todoCount: number;
  doneCount: number;
}

const filterOptions = {
  all: "모든 할 일",
  todo: "할 일",
  done: "완료한 일",
} as const;

export default function AllListTodo() {
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery(
    getInfiniteTodosByGoalIdOptions({ size: 40 }),
  );

  const { ref } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
  });

  const todos = data?.todos
    ?.filter((todo) => {
      if (filter === "all") return true;
      if (filter === "done") return todo.isDone === true;
      if (filter === "todo") return todo.isDone === false;
      return true;
    })
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const { data: todosLengths, isLoading } = useQuery<TodoLengths>({
    queryKey: todoKeys.counts,
    queryFn: () => getTodosLengths(),
  });

  const getTodoCount = () => {
    if (isLoading) return 0;
    if (filter === "all") return todosLengths?.AllCount;
    if (filter === "done") return todosLengths?.doneCount;
    if (filter === "todo") return todosLengths?.todoCount;

    return 0;
  };

  return (
    <>
      <div className="mb-16 mt-24 flex items-center justify-between">
        <h2 className="text-18 font-semibold text-slate-900">
          {filterOptions[filter]} (
          <span className={cn(isLoading && "animate-pulse")}>
            {getTodoCount()}
          </span>
          )
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 font-semibold text-dark-blue-600"
        >
          <PlusIcon />
          <span className="text-14/3">할일 추가</span>
        </button>
      </div>
      <div className="mb-16 w-full rounded-xl border-slate-300 bg-white p-16 text-sm text-slate-800 md:p-24 lg:mb-24 lg:p-24">
        <Filter filter={filter} setFilter={setFilter} />
        <ul className="flex flex-col gap-8">
          {todos?.length !== 0 ? (
            todos?.map((todo) => <Todo key={todo.id} todo={todo} showGoal />)
          ) : (
            <div
              className="flex w-full items-center justify-center text-center"
              key="no-todos"
            >
              <p>
                {filter === "todo" && "아직 해야 할 일이 없어요"}
                {filter === "done" && "아직 다 한 일이 없어요"}
                {filter === "all" && "할 일이 없어요"}
              </p>
            </div>
          )}
        </ul>
        {/* 페이지가 남아 있을 경우에만 추가 데이터 요청 */}
        {hasNextPage && <div ref={ref} className="h-1" />}
      </div>
      {isModalOpen && (
        <TodoModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      )}
    </>
  );
}
