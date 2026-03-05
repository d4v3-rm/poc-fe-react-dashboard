import type { LanguageCode } from "../../../shared/i18n/i18n.types";
import type { TaskItem, TaskStatus } from "../task.types";

export type TaskListViewProps = {
  tasks: TaskItem[];
  statuses: TaskStatus[];
  language: LanguageCode;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
  onOpenTaskDetails: (taskId: string) => void;
};
