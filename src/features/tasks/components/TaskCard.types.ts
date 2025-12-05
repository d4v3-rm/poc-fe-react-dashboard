import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import type { TaskItem, TaskStatus } from "../task.types";

export type TaskCardProps = {
  task: TaskItem;
  status: TaskStatus;
  statuses: TaskStatus[];
  language: "en" | "it";
  compact?: boolean;
  isOverlay?: boolean;
  showActions?: boolean;
  showDragHandle?: boolean;
  onOpenDetails: (taskId: string) => void;
  dragHandleProps?: {
    attributes?: DraggableAttributes;
    listeners?: DraggableSyntheticListeners;
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
  };
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
};

export type TaskCardHeaderProps = Pick<
  TaskCardProps,
  | "task"
  | "status"
  | "statuses"
  | "showDragHandle"
  | "dragHandleProps"
  | "onStatusChange"
>;

export type TaskCardFooterProps = Pick<
  TaskCardProps,
  "task" | "language" | "showActions" | "onEdit" | "onDelete"
>;
