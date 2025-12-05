import { ProjectFormModal } from "../../../features/projects/components/ProjectFormModal";
import { StatusFormModal } from "../../../features/tasks/components/StatusFormModal";
import { TaskDetailsDrawer } from "../../../features/tasks/components/TaskDetailsDrawer";
import { TaskEditorDrawer } from "../../../features/tasks/components/TaskEditorDrawer";
import { ThemeSettingsModal } from "../../../features/theme/components/ThemeSettingsModal";
import type { DashboardModalsProps } from "./DashboardModals.types";

export const DashboardModals = ({
  language,
  themeMode,
  themeColors,
  isProjectModalOpen,
  projectEditorMode,
  projectDraft,
  onProjectCancel,
  onProjectSubmit,
  isStatusModalOpen,
  statusEditorMode,
  statusDraft,
  onStatusCancel,
  onStatusSubmit,
  isTaskDrawerOpen,
  taskEditorMode,
  activeTask,
  taskStatuses,
  availableTags,
  onTaskCancel,
  onTaskSubmit,
  isTaskDetailsOpen,
  activeTaskDetails,
  onTaskDetailsClose,
  onTaskEdit,
  isThemeModalOpen,
  onThemeClose,
  onThemeModeChange,
  onThemeColorsChange,
}: DashboardModalsProps) => {
  return (
    <>
      <ProjectFormModal
        initialValues={
          projectEditorMode === "edit" && projectDraft
            ? {
                name: projectDraft.name,
                description: projectDraft.description,
                tags: projectDraft.tags,
              }
            : undefined
        }
        mode={projectEditorMode}
        onCancel={onProjectCancel}
        onSubmit={onProjectSubmit}
        open={isProjectModalOpen}
      />

      <StatusFormModal
        initialValues={
          statusEditorMode === "edit" && statusDraft
            ? {
                name: statusDraft.name,
                color: statusDraft.color,
              }
            : undefined
        }
        mode={statusEditorMode}
        onCancel={onStatusCancel}
        onSubmit={onStatusSubmit}
        open={isStatusModalOpen}
      />

      <TaskEditorDrawer
        initialTask={activeTask}
        mode={taskEditorMode}
        onClose={onTaskCancel}
        onSubmit={onTaskSubmit}
        open={isTaskDrawerOpen}
        statuses={taskStatuses}
        availableTags={availableTags}
      />

      <TaskDetailsDrawer
        language={language}
        onClose={onTaskDetailsClose}
        open={isTaskDetailsOpen}
        onEdit={onTaskEdit}
        statuses={taskStatuses}
        task={activeTaskDetails}
      />

      <ThemeSettingsModal
        onClose={onThemeClose}
        onThemeColorsChange={onThemeColorsChange}
        onThemeModeChange={onThemeModeChange}
        open={isThemeModalOpen}
        themeColors={themeColors}
        themeMode={themeMode}
      />
    </>
  );
};
