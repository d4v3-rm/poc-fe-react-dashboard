import type {
  DragEndEvent,
  DragStartEvent,
  SensorDescriptor,
  SensorOptions,
} from "@dnd-kit/core";
import type { TaskItem, TaskStatus } from "../../tasks/task.types";

export type UseKanbanBoardDragParams = {
  statuses: TaskStatus[];
  tasks: TaskItem[];
  onMoveTask: (
    taskId: string,
    targetStatusId: string,
    targetIndex?: number,
  ) => void;
};

export type UseKanbanBoardDragReturn = {
  activeTask: TaskItem | null;
  activeStatus: TaskStatus | null;
  groupedTasks: Record<string, TaskItem[]>;
  sensors: SensorDescriptor<SensorOptions>[];
  handleDragStart: (event: DragStartEvent) => void;
  handleDragCancel: () => void;
  handleDragEnd: (event: DragEndEvent) => void;
};
