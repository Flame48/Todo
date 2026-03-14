import { useSortable } from "@dnd-kit/sortable";
import type { TodoItem } from "../TodoStore";
import { jcn, type PT_className } from "../utils";

export function CheckIcon(props: {} & PT_className) {
  return (
    <svg
      className={jcn("", props.className)}
      width="10"
      height="8"
      viewBox="0 0 10 8"
      fill="none"
    >
      <path
        d="M1 4l3 3 5-6"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function DeleteIcon(props: {} & PT_className) {
  return (
    <svg
      className={jcn("", props.className)}
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
    >
      <path
        d="M2 3h9M4.5 3V2h4v1M5 5.5v4M8 5.5v4M2.5 3l.6 7.5h6.8L10.5 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DraggableHandle(props: { item: TodoItem } & PT_className) {
  const { attributes, listeners } = useSortable({
    id: props.item.id,
  });
  return (
    <span
      {...attributes}
      {...listeners}
      className={jcn("cursor-grab px-1 text-stone-300", props.className)}
    >
      ⠿
    </span>
  );
}
