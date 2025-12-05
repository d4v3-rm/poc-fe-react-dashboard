import type { Control, FieldErrors } from "react-hook-form";
import type { TaskFormValues } from "../task-editor.schema";
import type { TaskItem, TaskStatus } from "../task.types";

export type TaskEditorSubmitValues = {
  title: string;
  content: string;
  tags: string[];
  statusId: string;
  dueDate: string | null;
};

export type TaskEditorDrawerProps = {
  open: boolean;
  mode: "create" | "edit";
  statuses: TaskStatus[];
  availableTags?: string[];
  initialTask?: TaskItem | null;
  onClose: () => void;
  onSubmit: (values: TaskEditorSubmitValues) => void;
};

export type TaskEditorFormProps = {
  control: Control<TaskFormValues>;
  errors: FieldErrors<TaskFormValues>;
  statuses: TaskStatus[];
  availableTags: string[];
  isWideLayout: boolean;
};

export type TaskEditorPreviewProps = {
  content: string;
  previewTags: string[];
  previewStatus?: TaskStatus;
  previewDueDate: string;
};
