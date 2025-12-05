import type { LanguageCode } from "../../../shared/i18n/i18n.types";
import type { TaskItem, TaskStatus } from "../../tasks/task.types";

export type KanbanBoardProps = {
  statuses: TaskStatus[];
  tasks: TaskItem[];
  language: LanguageCode;
  onMoveTask: (
    taskId: string,
    targetStatusId: string,
    targetIndex?: number,
  ) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
  onOpenTaskDetails: (taskId: string) => void;
  onEditStatus: (status: TaskStatus) => void;
  onDeleteStatus: (status: TaskStatus) => void;
};
