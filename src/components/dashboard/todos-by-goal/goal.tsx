import { TodoResponse } from "@/types/todo";

import GoalIcon from "@/assets/goal.svg";

interface GoalProps {
  todo: TodoResponse;
}

export default function Goal({ todo: currentTodo }: GoalProps) {
  // goalInformation이 없으면 렌더링하지 않음
  const { goalInformation, isDone } = currentTodo;

  if (!goalInformation) return null;

  // isDone이 true일 때 취소선 적용
  return (
    <div className="flex items-center gap-10">
      <GoalIcon />
      <p className={`${isDone && "line-through"}`}>{goalInformation.title}</p>
    </div>
  );
}
