import { useState } from "react";
import { useTodoStore } from "./TodoStore";
import { AddTaskInput } from "./components/AddTaskInput";
import Header from "./Header";
import TaskDisplay from "./TaskDisplay";
import { jcn } from "./utils";

export default function TodoApp() {
  const todos = useTodoStore((s) => s.todos);
  const [editingId, setEditingId] = useState<string | null>(null);
  const handleAdded = (id: string) => {
    setEditingId(id);
  };

  return (
    <div
      className={jcn(
        "flex flex-col w-full h-screen font-mono bg-stone-50 overflow-y-hidden",
        editingId !== null ? "noselect" : "",
      )}
    >
      {/* Header */}
      <Header />

      <div className="overflow-y-scroll w-full h-full">
        <section className="flex-1 px-4 py-4 space-y-6 max-w-md w-full mx-auto">
          <AddTaskInput position="top" onAdded={handleAdded} />

          {todos.length > 0 && <TaskDisplay editingId={editingId} />}

          {todos.length > 0 && (
            <AddTaskInput position="bottom" onAdded={handleAdded} />
          )}
        </section>
      </div>
    </div>
  );
}
