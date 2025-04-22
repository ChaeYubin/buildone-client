import Goal from "@/components/dashboard/todos-by-goal/goal";
import TodoTitleAndCheckBox from "@/components/todo/todo-title-checkbox";
import { TodoResponse } from "@/types/todo";

interface GoalsListComponentProps {
  recentTodos: TodoResponse[];
}
export default function GoalsListComponent({
  recentTodos,
}: GoalsListComponentProps) {
  return (
    <ul className="space-y-15 pb-20">
      {recentTodos.map((todo) => (
        <li key={todo.id} className="flex flex-col">
          <TodoTitleAndCheckBox todo={todo} />
          <Goal todo={todo} />
        </li>
      ))}
    </ul>
  );
}
