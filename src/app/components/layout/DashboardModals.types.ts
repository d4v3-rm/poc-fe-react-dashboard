import type { ProjectItem } from "../../../features/projects/project.types";
import type { TaskItem, TaskStatus } from "../../../features/tasks/task.types";
import type {
  ThemeColors,
  ThemeMode,
} from "../../../features/theme/theme.types";
import type {
  ProjectEditorMode,
  StatusEditorMode,
  TaskEditorMode,
} from "../../hooks/useDashboardDialogs.types";

export type DashboardModalsProps = {
  language: "en" | "it";
  themeMode: ThemeMode;
  themeColors: ThemeColors;
  isProjectModalOpen: boolean;
  projectEditorMode: ProjectEditorMode;
  projectDraft: ProjectItem | null;
  onProjectCancel: () => void;
  onProjectSubmit: (values: {
    name: string;
    description?: string;
    tags: string[];
  }) => void;
  isStatusModalOpen: boolean;
  statusEditorMode: StatusEditorMode;
  statusDraft: TaskStatus | null;
  onStatusCancel: () => void;
  onStatusSubmit: (values: { name: string; color: string }) => void;
  isTaskDrawerOpen: boolean;
  taskEditorMode: TaskEditorMode;
  activeTask?: TaskItem | null;
  taskStatuses: TaskStatus[];
  availableTags: string[];
  onTaskCancel: () => void;
  onTaskSubmit: (values: {
    title: string;
    content: string;
    tags: string[];
    statusId: string;
    dueDate: string | null;
  }) => void;
  isTaskDetailsOpen: boolean;
  activeTaskDetails: TaskItem | null;
  onTaskDetailsClose: () => void;
  onTaskEdit: (taskId: string) => void;
  isThemeModalOpen: boolean;
  onThemeClose: () => void;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemeColorsChange: (colors: ThemeColors) => void;
};
