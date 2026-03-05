import type { RefObject } from "react";
import type { ProjectItem } from "../../features/projects/project.types";
import type { TaskStatus } from "../../features/tasks/task.types";

export type TaskEditorMode = "create" | "edit";
export type ProjectEditorMode = "create" | "edit";
export type StatusEditorMode = "create" | "edit";

export type UseDashboardDialogsReturn = {
  projectEditorMode: ProjectEditorMode;
  isProjectModalOpen: boolean;
  projectDraft: ProjectItem | null;
  editingTaskId: string | null;
  taskEditorMode: TaskEditorMode;
  isTaskDrawerOpen: boolean;
  statusEditorMode: StatusEditorMode;
  statusDraft: TaskStatus | null;
  isStatusModalOpen: boolean;
  isThemeModalOpen: boolean;
  isTaskDetailsOpen: boolean;
  taskDetailsId: string | null;
  isProjectPanelCollapsed: boolean;
  importInputRef: RefObject<HTMLInputElement | null>;
  openProjectCreate: () => void;
  openProjectEdit: (project: ProjectItem) => void;
  closeProjectModal: () => void;
  openTaskCreate: () => void;
  openTaskEdit: (taskId: string) => void;
  openTaskDetails: (taskId: string) => void;
  closeTaskDetails: () => void;
  closeTaskEditor: () => void;
  openStatusCreate: () => void;
  openStatusEdit: (status: TaskStatus) => void;
  closeStatusModal: () => void;
  openThemeModal: () => void;
  closeThemeModal: () => void;
  setProjectPanelCollapsed: (value: boolean) => void;
};
