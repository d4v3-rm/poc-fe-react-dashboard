import { Grid } from "antd";
import { useEffect } from "react";
import { DashboardPageShell } from "./components/layout/DashboardPageShell";
import { useDashboardDialogs } from "./hooks/useDashboardDialogs";
import { useDashboardProjectActions } from "./hooks/useDashboardProjectActions";
import { useDashboardState } from "./hooks/useDashboardState";
import { useDashboardStatusActions } from "./hooks/useDashboardStatusActions";
import { useDashboardTaskActions } from "./hooks/useDashboardTaskActions";
import { useDashboardTransferActions } from "./hooks/useDashboardTransferActions";

export const DashboardPage = () => {
  const {
    projects,
    activeProjectId,
    activeProject,
    activeTaskTags,
    filteredTasks,
    viewMode,
    filters,
    language,
    themeMode,
    themeColors,
    setActiveProject,
    setViewMode,
    setFilterQuery,
    setFilterStatusIds,
    setFilterTagIds,
    setDueFilter,
    clearFilters,
    setLanguage,
    setThemeMode,
    setThemeColors,
    createProject,
    updateProject,
    removeProject,
    createTask,
    updateTask,
    removeTask,
    moveTask,
    addStatus,
    updateStatus,
    removeStatus,
    importSnapshot,
    getSnapshot,
  } = useDashboardState();

  const {
    projectEditorMode,
    isProjectModalOpen,
    projectDraft,
    editingTaskId,
    taskEditorMode,
    isTaskDrawerOpen,
    statusEditorMode,
    statusDraft,
    isStatusModalOpen,
    isThemeModalOpen,
    isTaskDetailsOpen,
    taskDetailsId,
    isProjectPanelCollapsed,
    importInputRef,
    openProjectCreate,
    openProjectEdit,
    closeProjectModal,
    openTaskCreate,
    openTaskEdit,
    openTaskDetails,
    closeTaskDetails,
    closeTaskEditor,
    openStatusCreate,
    openStatusEdit,
    closeStatusModal,
    openThemeModal,
    closeThemeModal,
    setProjectPanelCollapsed,
  } = useDashboardDialogs();

  const screens = Grid.useBreakpoint();
  const isCompactLayout = !screens.lg;

  const editingTask =
    activeProject?.tasks.find((task) => task.id === editingTaskId) ?? null;
  const viewedTask =
    activeProject?.tasks.find((task) => task.id === taskDetailsId) ?? null;
  const hasActiveProject = activeProject !== null;

  const activeStatuses = activeProject?.statuses ?? [];

  useEffect(() => {
    if (isCompactLayout) {
      setProjectPanelCollapsed(true);
    }
  }, [isCompactLayout, setProjectPanelCollapsed]);

  const { handleProjectSubmit, handleProjectDelete } =
    useDashboardProjectActions({
      language,
      projectEditorMode,
      projectDraft,
      createProject,
      updateProject,
      removeProject,
      closeProjectModal,
    });

  const { handleStatusSubmit, handleStatusDelete } = useDashboardStatusActions({
    activeProject,
    statusEditorMode,
    statusDraft,
    addStatus,
    updateStatus,
    removeStatus,
    closeStatusModal,
  });

  const {
    handleTaskSubmit,
    handleTaskDelete,
    handleTaskStatusChange,
    handleMoveTask,
  } = useDashboardTaskActions({
    activeProject,
    taskEditorMode,
    editingTaskId,
    createTask,
    updateTask,
    removeTask,
    moveTask,
    closeTaskEditor,
  });

  const { handleExport, triggerImport, handleImportFile } =
    useDashboardTransferActions({
      importInputRef,
      importSnapshot,
      getSnapshot,
    });

  const projectPanelProps = {
    isCompactLayout,
    isCollapsed: isProjectPanelCollapsed,
    onCollapseChange: setProjectPanelCollapsed,
    projects,
    activeProjectId,
    onOpenThemeSettings: openThemeModal,
    onCreateProject: openProjectCreate,
    onSelectProject: setActiveProject,
    onEditProject: openProjectEdit,
    onDeleteProject: handleProjectDelete,
  };

  const workspaceProps = {
    activeProject,
    viewMode,
    filters,
    language,
    availableTags: activeTaskTags,
    onClearFilters: clearFilters,
    onCreateTask: () => {
      if (!hasActiveProject) {
        return;
      }

      openTaskCreate();
    },
    onDueFilterChange: setDueFilter,
    onLanguageChange: setLanguage,
    onSearchChange: setFilterQuery,
    onStatusFilterChange: setFilterStatusIds,
    onTagFilterChange: setFilterTagIds,
    onViewModeChange: setViewMode,
    onAddStatus: openStatusCreate,
    onOpenTaskDetails: openTaskDetails,
    onEditTask: openTaskEdit,
    onDeleteTask: handleTaskDelete,
    onStatusChange: handleTaskStatusChange,
    onMoveTask: handleMoveTask,
    onEditStatus: openStatusEdit,
    onDeleteStatus: handleStatusDelete,
    onExport: handleExport,
    onImport: triggerImport,
    tasks: filteredTasks,
    statusActionsDisabled: !hasActiveProject,
  };

  const modalProps = {
    language,
    themeMode,
    themeColors,
    isProjectModalOpen,
    projectEditorMode,
    projectDraft,
    onProjectCancel: closeProjectModal,
    onProjectSubmit: handleProjectSubmit,
    isStatusModalOpen,
    statusEditorMode,
    statusDraft,
    onStatusCancel: closeStatusModal,
    onStatusSubmit: handleStatusSubmit,
    isTaskDrawerOpen,
    taskEditorMode,
    activeTask: editingTask,
    taskStatuses: activeStatuses,
    availableTags: activeTaskTags,
    onTaskCancel: closeTaskEditor,
    onTaskSubmit: handleTaskSubmit,
    isTaskDetailsOpen,
    activeTaskDetails: viewedTask,
    onTaskDetailsClose: closeTaskDetails,
    onTaskEdit: openTaskEdit,
    isThemeModalOpen,
    onThemeClose: closeThemeModal,
    onThemeModeChange: setThemeMode,
    onThemeColorsChange: setThemeColors,
  };

  return (
    <DashboardPageShell
      importInputRef={importInputRef}
      onImportFile={handleImportFile}
      projectPanelProps={projectPanelProps}
      workspaceProps={workspaceProps}
      modalProps={modalProps}
    />
  );
};
