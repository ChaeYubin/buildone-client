import CheckBoxOffIcon from "@/assets/icons-small/checkbox/checkbox_off.svg";
import CheckBoxOnIcon from "@/assets/icons-small/checkbox/checkbox_on.svg";
import { useUpdateTodo } from "@/hooks/query/use-todo";
import { cn } from "@/lib/cn";
import { TodoResponse } from "@/types/todo";

interface TodoTitleAndCheckBoxProps {
  todo: TodoResponse;
}

export default function TodoTitleAndCheckBox({
  todo,
}: TodoTitleAndCheckBoxProps) {
  const { isDone } = todo;
  const { mutate: toggleStatus, isPending } = useUpdateTodo({});

  return (
    <div
      className={cn(
        "flex h-24 w-full items-center gap-10",
        isPending && "animate-pulse",
      )}
    >
      <label
        htmlFor={`todo-check-${todo.id}`}
        className="relative flex cursor-pointer items-center hover:drop-shadow"
        aria-label={`${todo.title} ${isDone ? "완료됨" : "미완료"}`}
      >
        <input
          type="checkbox"
          id={`todo-check-${todo.id}`}
          checked={isDone}
          aria-checked={isDone}
          onChange={() =>
            toggleStatus({
              todoId: todo.id,
              newTodo: {
                ...todo,
                isDone: !todo.isDone,
              },
            })
          }
          className="peer absolute hidden"
        />
        {isDone ? <CheckBoxOnIcon /> : <CheckBoxOffIcon />}
      </label>
      <p
        className={`line-clamp-1 cursor-default hover:font-bold hover:text-dark-blue-700 ${isDone && "line-through"}`}
      >
        {todo.title}
      </p>
    </div>
  );
}
