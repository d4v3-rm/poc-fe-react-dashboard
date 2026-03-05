import type { DueFilter, ViewMode } from "../../../app/dashboard.types";
import type { ProjectItem } from "../../../features/projects/project.types";
import type { LanguageCode } from "../../../shared/i18n/i18n.types";
import type { DashboardFilters } from "../../../store/dashboard-store.types";
import type { TaskItem, TaskStatus } from "../../../features/tasks/task.types";

export type DashboardWorkspaceProps = {
  activeProject: ProjectItem | null;
  viewMode: ViewMode;
  filters: DashboardFilters;
  language: LanguageCode;
  availableTags: string[];
  onClearFilters: () => void;
  onCreateTask: () => void;
  onDueFilterChange: (due: DueFilter) => void;
  onLanguageChange: (language: LanguageCode) => void;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (statusIds: string[]) => void;
  onTagFilterChange: (tagIds: string[]) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onAddStatus: () => void;
  onOpenTaskDetails: (taskId: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
  onMoveTask: (
    taskId: string,
    targetStatusId: string,
    targetIndex?: number,
  ) => void;
  onEditStatus: (status: TaskStatus) => void;
  onDeleteStatus: (status: TaskStatus) => void;
  onExport: () => void;
  onImport: () => void;
  tasks: TaskItem[];
  statusActionsDisabled: boolean;
};

export type DashboardWorkspaceHeaderProps = {
  projectName: string;
  projectDescription: string;
};

export type DashboardWorkspaceContentProps = Pick<
  DashboardWorkspaceProps,
  | "viewMode"
  | "language"
  | "tasks"
  | "onDeleteTask"
  | "onEditTask"
  | "onStatusChange"
  | "onOpenTaskDetails"
  | "onMoveTask"
  | "onEditStatus"
  | "onDeleteStatus"
> & {
  statuses: TaskStatus[];
};
