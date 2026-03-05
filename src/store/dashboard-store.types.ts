import type { ProjectItem } from "../features/projects/project.types";
import type { TaskItem, TaskStatus } from "../features/tasks/task.types";
import type { DueFilter, ViewMode } from "../app/dashboard.types";
import type { ThemeColors, ThemeMode } from "../features/theme/theme.types";
import type { LanguageCode } from "../shared/i18n/i18n.types";

export type DashboardFilters = {
  query: string;
  statusIds: string[];
  tagIds: string[];
  due: DueFilter;
};

export type DashboardSnapshot = {
  projects: ProjectItem[];
  activeProjectId: string | null;
  viewMode: ViewMode;
  filters: DashboardFilters;
  language: LanguageCode;
  themeMode: ThemeMode;
  themeColors: ThemeColors;
};

export type DashboardStoreState = DashboardSnapshot;

export type CreateProjectInput = {
  name: string;
  description?: string;
  statuses?: Array<Pick<TaskStatus, "name" | "color">>;
  tags?: string[];
};

export type UpdateProjectInput = {
  name: string;
  description?: string;
  tags?: string[];
};

export type CreateTaskInput = {
  title: string;
  content: string;
  tags: string[];
  statusId: string;
  dueDate: string | null;
};

export type UpdateTaskInput = {
  title: string;
  content: string;
  tags: string[];
  statusId: string;
  dueDate: string | null;
};

export type CreateStatusInput = {
  name: string;
  color: string;
};

export type UpdateStatusInput = {
  name: string;
  color: string;
};

export type DashboardStoreActions = {
  setActiveProject: (projectId: string) => void;
  setViewMode: (mode: ViewMode) => void;
  setFilterQuery: (query: string) => void;
  setFilterStatusIds: (statusIds: string[]) => void;
  setFilterTagIds: (tagIds: string[]) => void;
  setDueFilter: (due: DueFilter) => void;
  clearFilters: () => void;
  setLanguage: (language: LanguageCode) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setThemeColors: (colors: ThemeColors) => void;
  createProject: (input: CreateProjectInput) => string;
  updateProject: (projectId: string, input: UpdateProjectInput) => void;
  removeProject: (projectId: string) => void;
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
  addStatus: (projectId: string, input: CreateStatusInput) => string;
  updateStatus: (
    projectId: string,
    statusId: string,
    input: UpdateStatusInput,
  ) => void;
  removeStatus: (projectId: string, statusId: string) => void;
  importSnapshot: (snapshot: DashboardSnapshot) => void;
  getSnapshot: () => DashboardSnapshot;
  getActiveProject: () => ProjectItem | null;
  getTaskById: (taskId: string) => TaskItem | null;
};

export type DashboardStore = DashboardStoreState & DashboardStoreActions;
