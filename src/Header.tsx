import { useTodoStore, isToday } from "./TodoStore";
import { type PT_className, jcn } from "./utils";

export default function Header(props: {} & PT_className) {
  const todos = useTodoStore((s) => s.todos);
  const sortByPriority = useTodoStore((s) => s.sortByPriority);

  const todayTodos = todos.filter((t) => isToday(t.priority));

  const activeToday = todayTodos.filter((t) => !t.complete).length;
  const totalToday = todayTodos.length;

  const exportClipboard = () => {
    const exp = todos
      .map((t) => `- [${t.complete ? "X" : " "}] ${t.content} (${t.priority})`)
      .join("\n");
    navigator.clipboard.writeText(exp);
  };
  return (
    <header
      className={jcn(
        "bg-lime-800 px-6 pt-8 pb-5 sticky top-0 z-10",
        props.className,
      )}
    >
      <h1 className="text-2xl font-semibold text-stone-100 tracking-tight">
        TODOs
      </h1>
      <p className="text-xs text-slate-400 mt-1 mb-1">
        {activeToday === 0
          ? totalToday > 0
            ? "All done for today"
            : "Nothing scheduled today"
          : `${activeToday} of ${totalToday} today remaining`}
      </p>
      <span className="flex gap-4">
        <button
          onClick={() => sortByPriority()}
          className="bg-slate-400 text-stone-100 px-4 py-1 cursor-pointer"
        >
          Sort
        </button>
        <button
          onClick={() => exportClipboard()}
          className="bg-slate-400 text-stone-100 px-4 py-1 cursor-pointer"
        >
          Copy
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-400 text-stone-100 px-4 py-1 cursor-pointer"
        >
          Update
        </button>
      </span>
    </header>
  );
}
