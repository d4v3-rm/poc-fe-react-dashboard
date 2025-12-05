import dayjs from "dayjs";
import type { TaskFormValues } from "../task-editor.schema";
import type { TaskItem, TaskStatus } from "../task.types";
import type { TaskEditorSubmitValues } from "./TaskEditorDrawer.types";

export const normalizeTaskEditorTags = (tags: string[] = []) =>
  Array.from(
    new Set(tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)),
  );

export const getTaskEditorDefaultValues = (
  statuses: TaskStatus[],
): TaskFormValues => ({
  title: "",
  content: "",
  tags: [],
  statusId: statuses[0]?.id ?? "",
  dueDate: null,
});

export const getTaskEditorInitialValues = (
  initialTask: TaskItem | null | undefined,
  statuses: TaskStatus[],
): TaskFormValues => ({
  title: initialTask?.title ?? "",
  content: initialTask?.content ?? "",
  tags: normalizeTaskEditorTags(initialTask?.tags),
  statusId: initialTask?.statusId ?? statuses[0]?.id ?? "",
  dueDate: initialTask?.dueDate ? dayjs(initialTask.dueDate) : null,
});

export const serializeTaskEditorValues = (
  values: TaskFormValues,
): TaskEditorSubmitValues => ({
  title: values.title,
  content: values.content,
  tags: normalizeTaskEditorTags(values.tags),
  statusId: values.statusId,
  dueDate: values.dueDate ? values.dueDate.toISOString() : null,
});
