import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard } from "../../tasks/components/TaskCard";
import type { SortableTaskCardProps } from "./SortableTaskCard.types";

export const SortableTaskCard = ({
  task,
  status,
  statuses,
  language,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onOpenTaskDetails,
}: SortableTaskCardProps) => {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.95 : 1,
      }}
    >
      <TaskCard
        compact
        language={language}
        onDelete={onDeleteTask}
        onEdit={onEditTask}
        onStatusChange={onStatusChange}
        onOpenDetails={onOpenTaskDetails}
        status={status}
        statuses={statuses}
        task={task}
        showDragHandle
        dragHandleProps={{
          attributes,
          listeners,
          setActivatorNodeRef,
        }}
      />
    </div>
  );
};
