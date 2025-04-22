"use client";

import { useState } from "react";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { cn } from "@/lib/cn";
import { getInfiniteTodosByGoalIdOptions } from "@/services/todo/query";

import Todo from "../todo/todo";
import TodoModal from "../todo-modal/todo-modal";
import TodoModalOpenButton from "../todo-modal/todo-modal-open-button";

import ScrollListGradientProvider from "./scroll-list-gradient-provider";

interface TodoListProps {
  goalId: string;
  done: boolean;
}

export default function TodoList({ goalId, done }: TodoListProps) {
  const [showCreateTodoModal, setShowCreateTodoModal] = useState(false);

  const { data, fetchNextPage, hasNextPage } = useSuspenseInfiniteQuery(
    getInfiniteTodosByGoalIdOptions({
      goalId: Number(goalId),
      size: 7,
      done,
    }),
  );

  const { ref } = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
  });

  return (
    <>
      <div
        className={cn(
          "relative min-h-228 w-full rounded-12 px-24 py-16",
          done ? "bg-slate-200" : "bg-white",
        )}
      >
        <div className="flex justify-between">
          <h3 className="slate-800 text-lg font-bold">
            {done ? "Done" : "To do"}
          </h3>
          {!done && (
            <TodoModalOpenButton onClick={() => setShowCreateTodoModal(true)} />
          )}
        </div>
        {data.todos.length > 0 ? (
          <ScrollListGradientProvider
            scrollListStyle={cn("mt-16 max-h-152", done && "white")}
            gradientStyle={done ? "from-slate-200" : ""}
          >
            <ul className="flex flex-col gap-8 pr-5">
              {data.todos.map((todo) => (
                <Todo key={`todo-list-by-goal-${todo.id}`} todo={todo} />
              ))}
            </ul>
            {hasNextPage && (
              <div ref={ref} className="flex justify-center pb-15 pt-20" />
            )}
          </ScrollListGradientProvider>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-normal text-slate-500">
              {done ? "다 한 일이 아직 없어요" : "해야 할 일이 아직 없어요"}
            </span>
          </div>
        )}
      </div>
      {showCreateTodoModal && (
        <TodoModal
          goalId={Number(goalId)}
          open={showCreateTodoModal}
          onOpenChange={setShowCreateTodoModal}
        />
      )}
    </>
  );
}
