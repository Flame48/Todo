import {
  useTodoStore,
  isToday,
  type Priority,
  PRIORITY_META,
} from "./TodoStore";
import { type PT_className, jcn } from "./utils";

export default function Header(props: {} & PT_className) {
  const todos = useTodoStore((s) => s.todos);
  const sortByPriority = useTodoStore((s) => s.sortByPriority);
  const importTodos = useTodoStore((s) => s.importTodos);

  const todayTodos = todos.filter((t) => isToday(t.priority));

  const activeToday = todayTodos.filter((t) => !t.complete).length;
  const totalToday = todayTodos.length;

  const exportClipboard = () => {
    const exp = todos
      .map((t) => `- [${t.complete ? "X" : " "}] ${t.content} (${t.priority})`)
      .join("\n");
    navigator.clipboard.writeText(exp);
  };

  const importClipboard = async () => {
    const text = await navigator.clipboard.readText();
    const lines = text.split(/\r?\n/).filter(Boolean);

    const items = lines.flatMap((line) => {
      const match = line.match(/^- \[( |X)\] (.+) \(([A-Z]+)\)$/);
      if (!match) return [];
      const [, complete, content, priority] = match;
      if (!(priority in PRIORITY_META)) return [];
      return [
        {
          content,
          priority: priority as Priority,
          complete: complete.toUpperCase() === "X",
        },
      ];
    });

    if (items.length > 0) importTodos(items);
  };

  return (
    <header
      className={jcn(
        "bg-slate-800 px-6 pt-8 pb-5 sticky top-0 z-10",
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
          onClick={() => importClipboard()}
          className="bg-slate-400 text-stone-100 px-4 py-1 cursor-pointer"
        >
          Paste
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
