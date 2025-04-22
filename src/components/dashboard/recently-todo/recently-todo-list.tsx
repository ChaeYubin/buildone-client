"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import ScrollListGradientProvider from "@/components/goal-detail/scroll-list-gradient-provider";
import Todo from "@/components/todo/todo";
import { getDashboardOptions } from "@/services/dashboard/query";

export default function RecentlyTodoList() {
  const { data } = useSuspenseQuery(getDashboardOptions());

  const { todos } = data;

  return (
    <>
      {todos?.length > 0 && (
        <ScrollListGradientProvider scrollListStyle="max-h-152">
          <ul className="flex flex-col gap-8 pr-8">
            {todos.map((todo) => (
              <Todo key={todo.id} todo={todo} showGoal />
            ))}
          </ul>
        </ScrollListGradientProvider>
      )}
      {todos?.length === 0 && (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-sm text-slate-500">
            최근에 등록한 할 일이 없어요
          </span>
        </div>
      )}
    </>
  );
}
