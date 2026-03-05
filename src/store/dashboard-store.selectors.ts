import type { ProjectItem } from "../features/projects/project.types";
import type { TaskItem } from "../features/tasks/task.types";
import type {
  DashboardSnapshot,
  DashboardStore,
} from "./dashboard-store.types";

export const getSnapshotFromState = (
  state: DashboardStore,
): DashboardSnapshot => ({
  projects: state.projects,
  activeProjectId: state.activeProjectId,
  viewMode: state.viewMode,
  filters: state.filters,
  language: state.language,
  themeMode: state.themeMode,
  themeColors: state.themeColors,
});

export const getActiveProjectFromState = (
  state: DashboardStore,
): ProjectItem | null =>
  state.projects.find((project) => project.id === state.activeProjectId) ??
  null;

export const getTaskByIdFromState = (
  state: DashboardStore,
  taskId: string,
): TaskItem | null => {
  for (const project of state.projects) {
    const task = project.tasks.find((entry) => entry.id === taskId);

    if (task) {
      return task;
    }
  }

  return null;
};
