import { create } from "zustand";
import { persist } from "zustand/middleware";
import { arrayMove } from "@dnd-kit/sortable";

export type Priority =
  | "LT"
  | "MT"
  | "AT"
  | "WE"
  | "UR"
  | "NA"
  | "RM"
  | "LA"
  | "BT";

export interface TodoItem {
  id: string;
  content: string;
  priority: Priority;
  complete: boolean;
  createdAt: number;
}

export const PRIORITIES: Priority[] = [
  "UR",
  "RM",
  "AT",
  "MT",
  "BT",
  "LT",
  "LA",
  "WE",
  "NA",
];

export const PRIORITY_META: Record<
  Priority,
  { label: string; today: boolean; color: string; bg: string; value: number }
> = {
  LT: {
    label: "LT",
    today: true,
    color: "text-sky-700",
    bg: "bg-sky-100",
    value: 10,
  },
  MT: {
    label: "MT",
    today: true,
    color: "text-violet-700",
    bg: "bg-violet-100",
    value: 20,
  },
  BT: {
    label: "BT",
    today: true,
    value: 15,
    color: "text-orange-700",
    bg: "bg-orange-100",
  },
  AT: {
    label: "AT",
    today: true,
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    value: 30,
  },
  LA: {
    label: "LA",
    today: false,
    value: 7,
    color: "text-teal-700",
    bg: "bg-teal-100",
  },
  WE: {
    label: "WE",
    today: false,
    color: "text-amber-700",
    bg: "bg-amber-100",
    value: 5,
  },
  RM: {
    label: "RM",
    today: true,
    value: 40,
    color: "text-cyan-700",
    bg: "bg-cyan-100",
  },
  UR: {
    label: "UR",
    today: true,
    color: "text-rose-700",
    bg: "bg-rose-100",
    value: 1e4,
  },
  NA: {
    label: "NA",
    today: true,
    color: "text-stone-500",
    bg: "bg-stone-100",
    value: -1e4,
  },
};

export function isToday(p: Priority) {
  return PRIORITY_META[p].today;
}

function genId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

interface TodoStore {
  todos: TodoItem[];
  addTodoAndReturnId: (position: "top" | "bottom") => string;
  toggleComplete: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  updatePriority: (id: string, priority: Priority) => void;
  deleteTodo: (id: string) => void;
  sortByPriority: () => void;
  reorderTodos: (oldIndex: number, newIndex: number) => void;
  importTodos: (items: Omit<TodoItem, "id" | "createdAt">[]) => void;
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],

      addTodoAndReturnId: (position) => {
        const id = genId();
        const item: TodoItem = {
          id,
          content: "",
          priority: "NA",
          complete: false,
          createdAt: Date.now(),
        };
        set((state) => ({
          todos:
            position === "top"
              ? [item, ...state.todos]
              : [...state.todos, item],
        }));
        return id;
      },

      toggleComplete: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, complete: !t.complete } : t,
          ),
        })),

      updateContent: (id, content) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, content } : t)),
        })),

      updatePriority: (id, priority) =>
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, priority } : t)),
        })),

      sortByPriority: () =>
        set((state) => ({
          todos: [...state.todos].sort(
            (a, b) =>
              PRIORITY_META[b.priority].value - PRIORITY_META[a.priority].value,
          ),
        })),

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),

      reorderTodos: (oldIndex: number, newIndex: number) =>
        set((state) => ({
          todos: arrayMove(state.todos, oldIndex, newIndex),
        })),
      importTodos: (items: Omit<TodoItem, "id" | "createdAt">[]) =>
        set((state) => ({
          todos: [
            ...state.todos,
            ...items.map((item) => ({
              ...item,
              id: genId(),
              createdAt: Date.now(),
            })),
          ],
        })),
    }),
    { name: "todos-storage" },
  ),
);
