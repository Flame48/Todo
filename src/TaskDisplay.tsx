import {
  useSensors,
  useSensor,
  PointerSensor,
  DndContext,
  closestCenter,
  DragOverlay,
  TouchSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import TodoItemView from "./TodoItemView";
import { useTodoStore } from "./TodoStore";
import { type PT_className, jcn } from "./utils";

export default function TaskDisplay(
  props: { editingId: string | null } & PT_className,
) {
  const todos = useTodoStore((s) => s.todos);
  const reorderTodos = useTodoStore((s) => s.reorderTodos);

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeItem = todos.find((t) => t.id === activeId);
  const sensors = useSensors(
    // useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    reorderTodos(oldIndex, newIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={todos.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className={jcn("space-y-2 my-1", props.className)}>
          {todos.map((item) => (
            <TodoItemView
              key={item.id}
              item={item}
              autoFocus={props.editingId === item.id}
            />
          ))}
        </ul>
      </SortableContext>
      <DragOverlay>
        {activeItem ? (
          <TodoItemView item={activeItem} autoFocus={false} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
