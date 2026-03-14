import { useTodoStore } from "../TodoStore";
import { jcn, type PT_className } from "../utils";

export function AddTaskInput(
  props: {
    position: "top" | "bottom";
    onAdded: (id: string) => void;
  } & PT_className,
) {
  const addTodoAndReturnId = useTodoStore((s) => s.addTodoAndReturnId);

  const handleClick = () => {
    const id = addTodoAndReturnId(props.position);
    props.onAdded(id);
  };

  return (
    <button
      onClick={handleClick}
      className={jcn(
        "w-full flex items-center gap-2 px-4 py-3 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-xl transition-colors text-sm font-mono",
        props.className,
      )}
    >
      <span className="text-lg leading-none">+</span>
      <span>Add task</span>
    </button>
  );
}
