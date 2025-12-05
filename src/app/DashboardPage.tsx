import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { App as AntdApp, Grid, Layout, theme } from "antd";
import dayjs from "dayjs";
import { type ChangeEvent, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DashboardModals } from "./components/layout/DashboardModals";
import { DashboardWorkspace } from "./components/layout/DashboardWorkspace";
import { ProjectPanel } from "./components/layout/ProjectPanel";
import { DEFAULT_STATUS_TEMPLATES } from "../shared/utils/defaults";
import { dashboardSnapshotSchema } from "../store/dashboard.schema";
import type { ProjectItem } from "../features/projects/project.types";
import type { TaskStatus } from "../features/tasks/task.types";
import { useDashboardDialogs } from "./hooks/useDashboardDialogs";
import { useDashboardState } from "./hooks/useDashboardState";

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

  const { message, modal } = AntdApp.useApp();
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const isCompactLayout = !screens.lg;
  const overlayMaskStyle = {
    backgroundColor: "rgba(12, 22, 38, 0.44)",
    backdropFilter: "blur(2px)",
  };

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

  const handleProjectSubmit = (values: {
    name: string;
    description?: string;
    tags: string[];
  }) => {
    if (projectEditorMode === "create") {
      createProject({
        name: values.name,
        description: values.description,
        tags: values.tags,
        statuses: DEFAULT_STATUS_TEMPLATES[language],
      });
    } else if (projectDraft) {
      updateProject(projectDraft.id, {
        name: values.name,
        description: values.description,
        tags: values.tags,
      });
    }

    closeProjectModal();
  };

  const handleStatusSubmit = (values: { name: string; color: string }) => {
    if (!activeProject) {
      return;
    }

    if (statusEditorMode === "create") {
      addStatus(activeProject.id, values);
    } else if (statusDraft) {
      updateStatus(activeProject.id, statusDraft.id, values);
    }

    closeStatusModal();
  };

  const handleTaskSubmit = (values: {
    title: string;
    content: string;
    tags: string[];
    statusId: string;
    dueDate: string | null;
  }) => {
    if (!activeProject) {
      return;
    }

    const fallbackStatusId = activeProject.statuses[0]?.id ?? "";
    const safeStatusId = values.statusId || fallbackStatusId;

    if (taskEditorMode === "create") {
      createTask(activeProject.id, {
        title: values.title,
        content: values.content,
        tags: values.tags,
        dueDate: values.dueDate,
        statusId: safeStatusId,
      });
    } else if (editingTaskId) {
      updateTask(activeProject.id, editingTaskId, {
        title: values.title,
        content: values.content,
        tags: values.tags,
        dueDate: values.dueDate,
        statusId: safeStatusId,
      });
    }

    closeTaskEditor();
  };

  const handleExport = () => {
    const snapshot = getSnapshot();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `task-dashboard-${dayjs().format("YYYYMMDD-HHmmss")}.json`;
    link.click();
    URL.revokeObjectURL(url);
    void message.success(t("messages.exportReady"));
  };

  const triggerImport = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      const parsedJson = JSON.parse(content);
      const validated = dashboardSnapshotSchema.parse(parsedJson);
      importSnapshot(validated);
      void message.success(t("messages.importSuccess"));
    } catch {
      void message.error(t("messages.importError"));
    } finally {
      event.target.value = "";
    }
  };

  const handleProjectDelete = (project: ProjectItem) => {
    modal.confirm({
      centered: true,
      width: "min(460px, 95vw)",
      maskStyle: overlayMaskStyle,
      style: {
        borderRadius: token.borderRadiusLG,
      },
      icon: <DeleteOutlined style={{ color: token.colorError }} />,
      title: t("project.deleteConfirm.title"),
      content: t("project.deleteConfirm.description"),
      okText: t("actions.delete"),
      okButtonProps: {
        "aria-label": t("actions.delete"),
        icon: <DeleteOutlined />,
        danger: true,
      },
      okType: "danger",
      cancelText: t("actions.cancel"),
      cancelButtonProps: {
        "aria-label": t("actions.cancel"),
        icon: <CloseOutlined />,
      },
      onOk: () => {
        removeProject(project.id);
      },
    });
  };

  const handleStatusDelete = (status: TaskStatus) => {
    if (!activeProject) {
      return;
    }

    modal.confirm({
      centered: true,
      width: "min(460px, 95vw)",
      maskStyle: overlayMaskStyle,
      style: {
        borderRadius: token.borderRadiusLG,
      },
      icon: <DeleteOutlined style={{ color: token.colorError }} />,
      title: t("kanban.deleteStatusConfirm.title"),
      content: t("kanban.deleteStatusConfirm.description"),
      okText: t("actions.delete"),
      okButtonProps: {
        "aria-label": t("actions.delete"),
        icon: <DeleteOutlined />,
        danger: true,
      },
      okType: "danger",
      cancelText: t("actions.cancel"),
      cancelButtonProps: {
        "aria-label": t("actions.cancel"),
        icon: <CloseOutlined />,
      },
      onOk: () => {
        if (!activeProject) {
          return;
        }

        removeStatus(activeProject.id, status.id);
      },
    });
  };

  const handleTaskDelete = (taskId: string) => {
    if (!activeProject) {
      return;
    }

    removeTask(activeProject.id, taskId);
  };

  const handleTaskStatusChange = (taskId: string, statusId: string) => {
    if (!activeProject) {
      return;
    }

    moveTask(activeProject.id, taskId, statusId);
  };

  const handleMoveTask = (
    taskId: string,
    targetStatusId: string,
    targetIndex?: number,
  ) => {
    if (!activeProject) {
      return;
    }

    moveTask(activeProject.id, taskId, targetStatusId, targetIndex);
  };

  return (
    <div
      style={{
        height: "100dvh",
        minHeight: "100vh",
        overflow: "hidden",
        padding: 14,
        boxSizing: "border-box",
      }}
    >
      <input
        accept="application/json"
        style={{ display: "none" }}
        onChange={(event) => {
          void handleImportFile(event);
        }}
        ref={importInputRef}
        type="file"
      />

      <Layout
        hasSider
        style={{
          background: "transparent",
          minHeight: 0,
          height: "100%",
        }}
      >
        <ProjectPanel
          isCompactLayout={isCompactLayout}
          isCollapsed={isProjectPanelCollapsed}
          onCollapseChange={setProjectPanelCollapsed}
          projects={projects}
          activeProjectId={activeProjectId}
          onOpenThemeSettings={openThemeModal}
          onCreateProject={openProjectCreate}
          onSelectProject={setActiveProject}
          onEditProject={openProjectEdit}
          onDeleteProject={handleProjectDelete}
        />

        <DashboardWorkspace
          activeProject={activeProject}
          viewMode={viewMode}
          filters={filters}
          language={language}
          availableTags={activeTaskTags}
          onClearFilters={clearFilters}
          onCreateTask={() => {
            if (!hasActiveProject) {
              return;
            }

            openTaskCreate();
          }}
          onDueFilterChange={setDueFilter}
          onLanguageChange={setLanguage}
          onSearchChange={setFilterQuery}
          onStatusFilterChange={setFilterStatusIds}
          onTagFilterChange={setFilterTagIds}
          onViewModeChange={setViewMode}
          onAddStatus={openStatusCreate}
          onOpenTaskDetails={openTaskDetails}
          onEditTask={openTaskEdit}
          onDeleteTask={handleTaskDelete}
          onStatusChange={handleTaskStatusChange}
          onMoveTask={handleMoveTask}
          onEditStatus={openStatusEdit}
          onDeleteStatus={handleStatusDelete}
          onExport={handleExport}
          onImport={triggerImport}
          tasks={filteredTasks}
          statusActionsDisabled={!hasActiveProject}
        />
      </Layout>

      <DashboardModals
        language={language}
        themeMode={themeMode}
        themeColors={themeColors}
        isProjectModalOpen={isProjectModalOpen}
        projectEditorMode={projectEditorMode}
        projectDraft={projectDraft}
        onProjectCancel={closeProjectModal}
        onProjectSubmit={handleProjectSubmit}
        isStatusModalOpen={isStatusModalOpen}
        statusEditorMode={statusEditorMode}
        statusDraft={statusDraft}
        onStatusCancel={closeStatusModal}
        onStatusSubmit={handleStatusSubmit}
        isTaskDrawerOpen={isTaskDrawerOpen}
        taskEditorMode={taskEditorMode}
        activeTask={editingTask}
        taskStatuses={activeStatuses}
        availableTags={activeTaskTags}
        onTaskCancel={closeTaskEditor}
        onTaskSubmit={handleTaskSubmit}
        isTaskDetailsOpen={isTaskDetailsOpen}
        activeTaskDetails={viewedTask}
        onTaskDetailsClose={closeTaskDetails}
        onTaskEdit={openTaskEdit}
        isThemeModalOpen={isThemeModalOpen}
        onThemeClose={closeThemeModal}
        onThemeModeChange={setThemeMode}
        onThemeColorsChange={setThemeColors}
      />
    </div>
  );
};
