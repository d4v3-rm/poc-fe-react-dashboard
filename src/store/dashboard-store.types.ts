import type { ProjectItem } from "../features/projects/project.types";
import type {
  DueFilter,
  LanguageCode,
  TaskItem,
  TaskStatus,
  ViewMode,
} from "../features/tasks/task.types";

export type TaskFilters = {
  query: string;
  statusIds: string[];
  tagIds: string[];
  due: DueFilter;
};

export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  primary: string;
  secondary: string;
};

export type DashboardSnapshot = {
  projects: ProjectItem[];
  activeProjectId: string | null;
  viewMode: ViewMode;
  filters: TaskFilters;
  language: LanguageCode;
  themeMode: ThemeMode;
  themeColors: ThemeColors;
};

export type CreateProjectInput = {
  name: string;
  description?: string;
  statuses?: Array<Pick<TaskStatus, "name" | "color">>;
};

export type UpdateProjectInput = {
  name: string;
  description?: string;
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

export type DashboardStore = DashboardSnapshot & {
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
