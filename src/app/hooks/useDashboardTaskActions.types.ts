import type { ProjectItem } from "../../features/projects/project.types";
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "../../store/dashboard-store.types";
import type { TaskEditorMode } from "./useDashboardDialogs.types";

export type TaskFormValues = {
  title: string;
  content: string;
  tags: string[];
  statusId: string;
  dueDate: string | null;
};

export type UseDashboardTaskActionsParams = {
  activeProject: ProjectItem | null;
  taskEditorMode: TaskEditorMode;
  editingTaskId: string | null;
  createTask: (projectId: string, input: CreateTaskInput) => string;
  updateTask: (
    projectId: string,
    taskId: string,
    input: UpdateTaskInput,
  ) => void;
  removeTask: (projectId: string, taskId: string) => void;
  moveTask: (
    projectId: string,
    taskId: string,
    targetStatusId: string,
    targetIndex?: number,
  ) => void;
  closeTaskEditor: () => void;
};
