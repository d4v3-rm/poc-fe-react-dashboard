import type { ProjectItem } from "../../features/projects/project.types";
import type { LanguageCode } from "../../shared/i18n/i18n.types";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../../store/dashboard-store.types";
import type { ProjectEditorMode } from "./useDashboardDialogs.types";

export type ProjectFormValues = {
  name: string;
  description?: string;
  tags: string[];
};

export type UseDashboardProjectActionsParams = {
  language: LanguageCode;
  projectEditorMode: ProjectEditorMode;
  projectDraft: ProjectItem | null;
  createProject: (input: CreateProjectInput) => string;
  updateProject: (projectId: string, input: UpdateProjectInput) => void;
  removeProject: (projectId: string) => void;
  closeProjectModal: () => void;
};
