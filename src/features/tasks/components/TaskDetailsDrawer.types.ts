import type { LanguageCode } from "../../../shared/i18n/i18n.types";
import type { TaskItem, TaskStatus } from "../task.types";

export type TaskDetailsDrawerProps = {
  open: boolean;
  task: TaskItem | null;
  statuses: TaskStatus[];
  language: LanguageCode;
  onClose: () => void;
  onEdit: (taskId: string) => void;
};
