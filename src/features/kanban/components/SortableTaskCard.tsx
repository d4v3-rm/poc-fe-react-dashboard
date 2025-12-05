import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from '../../tasks/components/TaskCard';
import type { TaskItem, TaskStatus } from '../../tasks/task.types';

type SortableTaskCardProps = {
  task: TaskItem;
  status: TaskStatus;
  statuses: TaskStatus[];
  language: 'en' | 'it';
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
};

export const SortableTaskCard = ({
  task,
  status,
  statuses,
  language,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: SortableTaskCardProps) => {
  const {
    attributes,
    listeners,
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
      {...attributes}
      {...(listeners ?? {})}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.75 : 1,
      }}
    >
      <TaskCard
        compact
        language={language}
        onDelete={onDeleteTask}
        onEdit={onEditTask}
        onStatusChange={onStatusChange}
        status={status}
        statuses={statuses}
        task={task}
      />
    </div>
  );
};
