import type { ViewMode } from "../../app/dashboard.types";
import type { TaskStatus } from "../../features/tasks/task.types";
import type { DashboardFilters } from "../../store/dashboard-store.types";

export type DashboardToolbarProps = {
  viewMode: ViewMode;
  filters: DashboardFilters;
  statuses: TaskStatus[];
  availableTags: string[];
  language: "en" | "it";
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (statusIds: string[]) => void;
  onTagFilterChange: (tagIds: string[]) => void;
  onDueFilterChange: (due: DashboardFilters["due"]) => void;
  onClearFilters: () => void;
  onLanguageChange: (language: "en" | "it") => void;
  onCreateTask: () => void;
  onAddStatus: () => void;
  statusActionsDisabled?: boolean;
  onImport: () => void;
  onExport: () => void;
};

export type DashboardToolbarFiltersProps = Pick<
  DashboardToolbarProps,
  | "viewMode"
  | "filters"
  | "statuses"
  | "availableTags"
  | "onViewModeChange"
  | "onSearchChange"
  | "onStatusFilterChange"
  | "onTagFilterChange"
  | "onDueFilterChange"
  | "onClearFilters"
>;

export type DashboardToolbarActionsProps = Pick<
  DashboardToolbarProps,
  | "viewMode"
  | "language"
  | "onLanguageChange"
  | "onAddStatus"
  | "statusActionsDisabled"
  | "onImport"
  | "onExport"
  | "onCreateTask"
>;
