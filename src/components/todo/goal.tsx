import Link from "next/link";

import GoalIcon from "@/assets/icons-small/goal.svg";
import { TodoResponse } from "@/types/todo";

interface GoalProps {
  todo: TodoResponse;
}

export default function Goal({ todo: currentTodo }: GoalProps) {
  const { goalInformation } = currentTodo;
  if (!goalInformation) return null;
  return (
    <Link
      href={`/goals/${goalInformation.id}`}
      key={goalInformation.id}
      className="ml-27 mt-8 flex items-center gap-10 hover:font-bold hover:text-dark-blue-700 hover:underline"
    >
      <div className="relative">
        <GoalIcon />
      </div>
      <p className="line-clamp-1">{goalInformation.title}</p>
    </Link>
  );
}
