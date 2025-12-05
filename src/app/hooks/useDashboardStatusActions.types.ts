import type { ProjectItem } from "../../features/projects/project.types";
import type { TaskStatus } from "../../features/tasks/task.types";
import type {
  CreateStatusInput,
  UpdateStatusInput,
} from "../../store/dashboard-store.types";
import type { StatusEditorMode } from "./useDashboardDialogs.types";

export type StatusFormValues = {
  name: string;
  color: string;
};

export type UseDashboardStatusActionsParams = {
  activeProject: ProjectItem | null;
  statusEditorMode: StatusEditorMode;
  statusDraft: TaskStatus | null;
  addStatus: (projectId: string, input: CreateStatusInput) => string;
  updateStatus: (
    projectId: string,
    statusId: string,
    input: UpdateStatusInput,
  ) => void;
  removeStatus: (projectId: string, statusId: string) => void;
  closeStatusModal: () => void;
};
