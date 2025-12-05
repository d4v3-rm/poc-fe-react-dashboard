import { useRef, useState } from "react";
import type { RefObject } from "react";
import type { ProjectItem } from "../../features/projects/project.types";
import type { TaskStatus } from "../../features/tasks/task.types";

export type TaskEditorMode = "create" | "edit";
export type ProjectEditorMode = "create" | "edit";
export type StatusEditorMode = "create" | "edit";

type UseDashboardDialogsReturn = {
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

export const useDashboardDialogs = (): UseDashboardDialogsReturn => {
  const [projectEditorMode, setProjectEditorMode] =
    useState<ProjectEditorMode>("create");
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [projectDraft, setProjectDraft] = useState<ProjectItem | null>(null);

  const [taskEditorMode, setTaskEditorMode] =
    useState<TaskEditorMode>("create");
  const [isTaskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [statusEditorMode, setStatusEditorMode] =
    useState<StatusEditorMode>("create");
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<TaskStatus | null>(null);

  const [isThemeModalOpen, setThemeModalOpen] = useState(false);
  const [isTaskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [taskDetailsId, setTaskDetailsId] = useState<string | null>(null);
  const [isProjectPanelCollapsed, setProjectPanelCollapsed] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 992,
  );

  const importInputRef = useRef<HTMLInputElement>(null);

  const openProjectCreate = () => {
    setProjectEditorMode("create");
    setProjectDraft(null);
    setProjectModalOpen(true);
  };

  const openProjectEdit = (project: ProjectItem) => {
    setProjectEditorMode("edit");
    setProjectDraft(project);
    setProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setProjectModalOpen(false);
    setProjectDraft(null);
  };

  const openTaskCreate = () => {
    setTaskEditorMode("create");
    setEditingTaskId(null);
    setTaskDrawerOpen(true);
    setTaskDetailsOpen(false);
    setTaskDetailsId(null);
  };

  const openTaskEdit = (taskId: string) => {
    setTaskEditorMode("edit");
    setEditingTaskId(taskId);
    setTaskDetailsOpen(false);
    setTaskDetailsId(null);
    setTaskDrawerOpen(true);
  };

  const openTaskDetails = (taskId: string) => {
    setTaskDetailsId(taskId);
    setTaskDetailsOpen(true);
  };

  const closeTaskDetails = () => {
    setTaskDetailsOpen(false);
    setTaskDetailsId(null);
  };

  const closeTaskEditor = () => {
    setTaskDrawerOpen(false);
    setEditingTaskId(null);
    setTaskEditorMode("create");
    closeTaskDetails();
  };

  const openStatusCreate = () => {
    setStatusEditorMode("create");
    setStatusDraft(null);
    setStatusModalOpen(true);
  };

  const openStatusEdit = (status: TaskStatus) => {
    setStatusEditorMode("edit");
    setStatusDraft(status);
    setStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setStatusModalOpen(false);
    setStatusDraft(null);
  };

  const openThemeModal = () => setThemeModalOpen(true);
  const closeThemeModal = () => setThemeModalOpen(false);

  return {
    projectEditorMode,
    isProjectModalOpen,
    projectDraft,
    editingTaskId,
    taskEditorMode,
    isTaskDrawerOpen,
    statusEditorMode,
    statusDraft,
    isStatusModalOpen,
    isThemeModalOpen,
    isTaskDetailsOpen,
    taskDetailsId,
    isProjectPanelCollapsed,
    importInputRef,

    openProjectCreate,
    openProjectEdit,
    closeProjectModal,
    openTaskCreate,
    openTaskEdit,
    openTaskDetails,
    closeTaskDetails,
    closeTaskEditor,
    openStatusCreate,
    openStatusEdit,
    closeStatusModal,
    openThemeModal,
    closeThemeModal,
    setProjectPanelCollapsed,
  };
};
