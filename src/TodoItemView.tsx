import { useState, useRef, useEffect } from "react";
import {
  type TodoItem,
  type Priority,
  PRIORITIES,
  PRIORITY_META,
  useTodoStore,
} from "./TodoStore";
import { jcn, type PT_className } from "./utils";
import { useSortable } from "@dnd-kit/sortable";
import { DeleteIcon, CheckIcon, DraggableHandle } from "./components/Icons";

export function DeleteButton(props: { onClick?: () => void } & PT_className) {
  return (
    <button
      onClick={() => props.onClick?.()}
      className={jcn(
        "p-1.5 rounded-lg text-stone-300 hover:text-rose-400 hover:bg-rose-50 transition-all shrink-0",
        props.className,
      )}
      aria-label="Delete"
    >
      <DeleteIcon />
    </button>
  );
}

export function Checkbox(
  props: { item: TodoItem; onCheck?: () => void } & PT_className,
) {
  return (
    <button
      onClick={() => props.onCheck?.()}
      className={jcn(
        "h-5 w-5 shrink-0 rounded-full border-2 transition-colors flex items-center justify-center",
        props.item.complete
          ? "border-slate-800 bg-slate-800"
          : "border-stone-300 hover:border-stone-500",
      )}
    >
      {props.item.complete && <CheckIcon />}
    </button>
  );
}

export function PriorityDropdown(
  props: {
    item: TodoItem;
    onChange: React.ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>;
  } & PT_className,
) {
  const meta = PRIORITY_META[props.item.priority];
  return (
    <div className={jcn("shrink-0", props.className)}>
      <select
        value={props.item.priority}
        onChange={props.onChange}
        className={jcn(
          "text-sm font-mono font-medium rounded-md px-1.5 py-1 border-0 outline-none cursor-pointer appearance-none",
          meta.bg,
          meta.color,
        )}
      >
        {PRIORITIES.map((p) => (
          <option
            className={jcn(PRIORITY_META[p].bg, PRIORITY_META[p].color)}
            key={p}
            value={p}
          >
            {p}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TodoContent(
  props: {
    item: TodoItem;
    editing?: boolean;
    draft?: any;
    onClickEmpty?: () => void;
    onChange?: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
    onCommit?: (e: any) => void;
    onKeydown?: (e: any) => void;
  } & PT_className,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className={jcn("flex-1 min-w-0", props.className)}>
      {props.editing ? (
        <input
          autoFocus
          ref={inputRef}
          type="text"
          value={props.draft}
          onChange={props.onChange}
          onBlur={props.onCommit}
          onKeyDown={props.onKeydown}
          placeholder="Task name…"
          className="w-full text-base font-mono text-stone-800 bg-transparent outline-none placeholder-stone-300"
        />
      ) : (
        <span
          onClick={() => props.onClickEmpty?.()}
          className={jcn(
            "block text-base font-mono leading-snug cursor-text select-none",
            props.item.complete
              ? "line-through text-stone-400"
              : "text-stone-800",
          )}
        >
          {props.item.content || (
            <span className="text-stone-300">Untitled</span>
          )}
        </span>
      )}
    </div>
  );
}

export default function TodoItemView(props: {
  item: TodoItem;
  autoFocus?: boolean;
  isOverlay?: boolean;
}) {
  const [editing, setEditing] = useState(props.autoFocus);
  const [draft, setDraft] = useState(props.item.content);
  const { setNodeRef, isDragging } = useSortable({
    id: props.item.id,
  });

  const toggleComplete = useTodoStore((s) => s.toggleComplete);
  const updateContent = useTodoStore((s) => s.updateContent);
  const updatePriority = useTodoStore((s) => s.updatePriority);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);

  // Keep draft in sync if item.content changes externally
  useEffect(() => {
    if (!editing) setDraft(props.item.content);
  }, [props.item.content, editing]);

  const commitEdit = () => {
    const trimmed = draft.trim();
    if (trimmed) {
      updateContent(props.item.id, trimmed);
    } else {
      // If blank and was a new task, delete it
      deleteTodo(props.item.id);
      return;
    }
    setEditing(false);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePriority(props.item.id, e.target.value as Priority);
  };

  return (
    <li
      ref={setNodeRef}
      className={jcn(
        "group relative rounded-xl border transition-colors border-stone-200 bg-white",
        props.item.complete ? "opacity-50" : "",
        props.isOverlay ? "shadow-lg scale-[1.02] opacity-95" : "",
        isDragging ? "opacity-30" : "",
      )}
    >
      <div className="flex items-center gap-3 px-3 py-3">
        <DraggableHandle item={props.item} />

        <Checkbox
          item={props.item}
          onCheck={() => toggleComplete(props.item.id)}
        />

        <PriorityDropdown item={props.item} onChange={handlePriorityChange} />

        <TodoContent
          item={props.item}
          editing={editing}
          draft={draft}
          onClickEmpty={() => !props.item.complete && setEditing(true)}
          onChange={(e) => setDraft(e.target.value)}
          onCommit={commitEdit}
          onKeydown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commitEdit();
            }
            if (e.key === "Escape") {
              if (!props.item.content) {
                deleteTodo(props.item.id);
              } else {
                setDraft(props.item.content);
                setEditing(false);
              }
            }
          }}
        />

        <DeleteButton onClick={() => deleteTodo(props.item.id)} />
      </div>
    </li>
  );
}
