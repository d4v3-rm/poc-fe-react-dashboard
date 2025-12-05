import {
  CloseOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  App as AntdApp,
  Button,
  Card,
  Divider,
  Empty,
  Flex,
  Layout,
  Modal,
  Space,
  Tooltip,
  Typography,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { useShallow } from "zustand/react/shallow";
import { DashboardToolbar } from "./components/DashboardToolbar";
import { ThemeSidebarCard } from "./components/ThemeSidebarCard";
import { KanbanBoard } from "../features/kanban/components/KanbanBoard";
import { ProjectFormModal } from "../features/projects/components/ProjectFormModal";
import { ProjectSidebar } from "../features/projects/components/ProjectSidebar";
import type { ProjectItem } from "../features/projects/project.types";
import { TaskEditorDrawer } from "../features/tasks/components/TaskEditorDrawer";
import { TaskListView } from "../features/tasks/components/TaskListView";
import { StatusFormModal } from "../features/tasks/components/StatusFormModal";
import type { TaskStatus } from "../features/tasks/task.types";
import { TaskDetailsDrawer } from "../features/tasks/components/TaskDetailsDrawer";
import { filterTasks } from "../features/tasks/task-filters";
import { DEFAULT_STATUS_TEMPLATES } from "../shared/utils/defaults";
import { dashboardSnapshotSchema } from "../store/dashboard.schema";
import { useDashboardStore } from "../store/dashboard-store";

type TaskEditorMode = "create" | "edit";
type ProjectEditorMode = "create" | "edit";
type StatusEditorMode = "create" | "edit";

export const DashboardPage = () => {
  const {
    projects,
    activeProjectId,
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
  } = useDashboardStore(
    useShallow((state) => ({
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      viewMode: state.viewMode,
      filters: state.filters,
      language: state.language,
      themeMode: state.themeMode,
      themeColors: state.themeColors,
      setActiveProject: state.setActiveProject,
      setViewMode: state.setViewMode,
      setFilterQuery: state.setFilterQuery,
      setFilterStatusIds: state.setFilterStatusIds,
      setFilterTagIds: state.setFilterTagIds,
      setDueFilter: state.setDueFilter,
      clearFilters: state.clearFilters,
      setLanguage: state.setLanguage,
      setThemeMode: state.setThemeMode,
      setThemeColors: state.setThemeColors,
      createProject: state.createProject,
      updateProject: state.updateProject,
      removeProject: state.removeProject,
      createTask: state.createTask,
      updateTask: state.updateTask,
      removeTask: state.removeTask,
      moveTask: state.moveTask,
      addStatus: state.addStatus,
      updateStatus: state.updateStatus,
      removeStatus: state.removeStatus,
      importSnapshot: state.importSnapshot,
      getSnapshot: state.getSnapshot,
    })),
  );

  const { message, modal } = AntdApp.useApp();
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId, projects],
  );

  const activeTaskTags = useMemo(() => {
    if (!activeProject) {
      return [];
    }

    return Array.from(
      new Set(
        activeProject.tasks
          .flatMap((task) => task.tags)
          .filter((tag) => tag.length > 0),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [activeProject]);

  const filteredTasks = useMemo(() => {
    if (!activeProject) {
      return [];
    }

    return filterTasks(activeProject.tasks, filters);
  }, [activeProject, filters]);

  const [projectEditorMode, setProjectEditorMode] =
    useState<ProjectEditorMode>("create");
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [projectDraft, setProjectDraft] = useState<ProjectItem | null>(null);
  const [isProjectPanelCollapsed, setProjectPanelCollapsed] = useState(false);

  const [taskEditorMode, setTaskEditorMode] =
    useState<TaskEditorMode>("create");
  const [isTaskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [statusEditorMode, setStatusEditorMode] =
    useState<StatusEditorMode>("create");
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<TaskStatus | null>(null);
  const [isThemeModalOpen, setThemeModalOpen] = useState(false);
  const [isTaskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [taskDetailsId, setTaskDetailsId] = useState<string | null>(null);

  const importInputRef = useRef<HTMLInputElement>(null);

  const editingTask =
    editingTaskId && activeProject
      ? (activeProject.tasks.find((task) => task.id === editingTaskId) ?? null)
      : null;

  const viewedTask =
    taskDetailsId && activeProject
      ? (activeProject.tasks.find((task) => task.id === taskDetailsId) ?? null)
      : null;

  const openProjectCreate = () => {
    setProjectEditorMode("create");
    setProjectDraft(null);
    setProjectModalOpen(true);
  };

  const openProjectEdit = (project: ProjectItem) => {
    setProjectEditorMode("edit");
    setProjectDraft(project);
    setProjectModalOpen(true);
  };

  const openTaskCreate = () => {
    if (!activeProject) {
      return;
    }

    setTaskEditorMode("create");
    setEditingTaskId(null);
    setTaskDrawerOpen(true);
  };

  const openTaskEdit = (taskId: string) => {
    setTaskEditorMode("edit");
    setEditingTaskId(taskId);
    setTaskDetailsOpen(false);
    setTaskDetailsId(null);
    setTaskDrawerOpen(true);
  };

  const openTaskDetails = (taskId: string) => {
    setTaskDetailsId(taskId);
    setTaskDetailsOpen(true);
  };

  const closeTaskDetails = () => {
    setTaskDetailsOpen(false);
    setTaskDetailsId(null);
  };

  const openStatusCreate = () => {
    setStatusEditorMode("create");
    setStatusDraft(null);
    setStatusModalOpen(true);
  };

  const openStatusEdit = (status: TaskStatus) => {
    setStatusEditorMode("edit");
    setStatusDraft(status);
    setStatusModalOpen(true);
  };

  const handleProjectDelete = (project: ProjectItem) => {
    modal.confirm({
      centered: true,
      width: "min(460px, 95vw)",
      style: {
        borderRadius: token.borderRadiusLG,
      },
      icon: <DeleteOutlined style={{ color: token.colorError }} />,
      title: t("project.deleteConfirm.title"),
      content: t("project.deleteConfirm.description"),
      okText: "",
      okButtonProps: {
        "aria-label": t("actions.delete"),
        icon: <DeleteOutlined />,
        danger: true,
      },
      okType: "danger",
      cancelText: "",
      cancelButtonProps: {
        "aria-label": t("actions.cancel"),
        icon: <CloseOutlined />,
      },
      onOk: () => removeProject(project.id),
    });
  };

  const handleStatusDelete = (status: TaskStatus) => {
    if (!activeProject) {
      return;
    }

    modal.confirm({
      centered: true,
      width: "min(460px, 95vw)",
      style: {
        borderRadius: token.borderRadiusLG,
      },
      icon: <DeleteOutlined style={{ color: token.colorError }} />,
      title: t("kanban.deleteStatusConfirm.title"),
      content: t("kanban.deleteStatusConfirm.description"),
      okText: "",
      okButtonProps: {
        "aria-label": t("actions.delete"),
        icon: <DeleteOutlined />,
        danger: true,
      },
      okType: "danger",
      cancelText: "",
      cancelButtonProps: {
        "aria-label": t("actions.cancel"),
        icon: <CloseOutlined />,
      },
      onOk: () => removeStatus(activeProject.id, status.id),
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
        <Layout.Sider
          collapsed={isProjectPanelCollapsed}
          collapsedWidth={84}
          style={{
            background: "transparent",
            marginRight: 14,
          }}
          trigger={null}
          width={340}
        >
          <Flex style={{ height: "100%" }} vertical>
            <Flex gap={12} style={{ flex: 1, minHeight: 0 }} vertical>
              {!isProjectPanelCollapsed && (
                <Flex align="center" gap={10} justify="space-between">
                  <Flex align="center" gap={8}>
                    <Tooltip title={t("theme.openSettings")}>
                      <Button
                        aria-label={t("theme.openSettings")}
                        icon={<SettingOutlined />}
                        onClick={() => setThemeModalOpen(true)}
                        type="text"
                      />
                    </Tooltip>

                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {t("project.sectionTitle")}
                    </Typography.Title>
                  </Flex>

                  <Space size={8}>
                    <Tooltip title={t("project.create")}>
                      <Button
                        aria-label={t("project.create")}
                        icon={<PlusOutlined />}
                        onClick={openProjectCreate}
                        size="small"
                        type="primary"
                      />
                    </Tooltip>
                    <Tooltip title={t("project.collapsePanel")}>
                      <Button
                        aria-label={t("project.collapsePanel")}
                        icon={<LeftOutlined />}
                        onClick={() => setProjectPanelCollapsed(true)}
                        size="small"
                        type="text"
                      />
                    </Tooltip>
                  </Space>
                </Flex>
              )}

              {isProjectPanelCollapsed && (
                <Flex align="center" gap={8} vertical>
                  <Tooltip title={t("theme.openSettings")}>
                    <Button
                      aria-label={t("theme.openSettings")}
                      icon={<SettingOutlined />}
                      onClick={() => setThemeModalOpen(true)}
                      shape="circle"
                      type="text"
                    />
                  </Tooltip>

                  <Tooltip title={t("project.create")}>
                    <Button
                      aria-label={t("project.create")}
                      icon={<PlusOutlined />}
                      onClick={openProjectCreate}
                      shape="circle"
                      type="text"
                    />
                  </Tooltip>
                  <Tooltip title={t("project.expandPanel")}>
                    <Button
                      aria-label={t("project.expandPanel")}
                      icon={<RightOutlined />}
                      onClick={() => setProjectPanelCollapsed(false)}
                      shape="circle"
                      type="text"
                    />
                  </Tooltip>
                </Flex>
              )}

              {isProjectPanelCollapsed ? (
                <Flex
                  align="center"
                  gap={8}
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    paddingBottom: 8,
                  }}
                  vertical
                >
                  {projects.map((project) => {
                    return (
                      <Tooltip
                        key={project.id}
                        placement="right"
                        title={project.name}
                      >
                        <Button
                          aria-label={project.name}
                          icon={<FolderOpenOutlined />}
                          onClick={() => setActiveProject(project.id)}
                          shape="circle"
                          type={
                            activeProjectId === project.id
                              ? "primary"
                              : "default"
                          }
                        />
                      </Tooltip>
                    );
                  })}
                </Flex>
              ) : (
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    paddingRight: 2,
                  }}
                >
                  <ProjectSidebar
                    activeProjectId={activeProjectId}
                    onCreateProject={openProjectCreate}
                    onDeleteProject={handleProjectDelete}
                    onEditProject={openProjectEdit}
                    onSelectProject={setActiveProject}
                    projects={projects}
                    showHeader={false}
                  />
                </div>
              )}
            </Flex>
          </Flex>
        </Layout.Sider>
        <Layout.Content
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Flex
            gap={12}
            style={{ height: "100%", minHeight: 0, flexDirection: "column" }}
            vertical
          >
            <Card>
              <DashboardToolbar
                filters={filters}
                language={language}
                availableTags={activeTaskTags}
                onClearFilters={clearFilters}
                onCreateTask={openTaskCreate}
                onDueFilterChange={setDueFilter}
                onExport={handleExport}
                onImport={triggerImport}
                onLanguageChange={setLanguage}
                onSearchChange={setFilterQuery}
                onStatusFilterChange={setFilterStatusIds}
                onTagFilterChange={setFilterTagIds}
                onViewModeChange={setViewMode}
                statuses={activeProject?.statuses ?? []}
                viewMode={viewMode}
                onAddStatus={openStatusCreate}
                statusActionsDisabled={!activeProject}
              />
            </Card>

            <Card
              style={{
                flex: 1,
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
              styles={{
                body: {
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  minHeight: 0,
                  overflow: "hidden",
                  padding: 12,
                },
              }}
            >
              {!activeProject && (
                <Empty
                  description={t("project.empty")}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ marginTop: 36, marginBottom: 0 }}
                />
              )}

              {activeProject && viewMode === "list" && (
                <Flex
                  gap={12}
                  style={{
                    flex: 1,
                    minHeight: 0,
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                  vertical
                >
                  <Flex gap={2} vertical>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {activeProject.name}
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      {activeProject.description ||
                        t("project.form.description")}
                    </Typography.Text>
                  </Flex>

                  <Flex
                    style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
                    vertical
                  >
                    <TaskListView
                      language={language}
                      onDeleteTask={handleTaskDelete}
                      onEditTask={openTaskEdit}
                      onStatusChange={handleTaskStatusChange}
                      onOpenTaskDetails={openTaskDetails}
                      statuses={activeProject.statuses}
                      tasks={filteredTasks}
                    />
                  </Flex>
                </Flex>
              )}

              {activeProject && viewMode === "kanban" && (
                <Flex
                  gap={12}
                  style={{
                    flex: 1,
                    minHeight: 0,
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                  vertical
                >
                  <Flex gap={2} vertical>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      {activeProject.name}
                    </Typography.Title>
                    <Typography.Text type="secondary">
                      {activeProject.description ||
                        t("project.form.description")}
                    </Typography.Text>
                  </Flex>

                  <Flex
                    style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
                    vertical
                  >
                    <KanbanBoard
                      language={language}
                      onDeleteStatus={handleStatusDelete}
                      onDeleteTask={handleTaskDelete}
                      onEditStatus={openStatusEdit}
                      onEditTask={openTaskEdit}
                      onOpenTaskDetails={openTaskDetails}
                      onMoveTask={(taskId, targetStatusId, targetIndex) => {
                        moveTask(
                          activeProject.id,
                          taskId,
                          targetStatusId,
                          targetIndex,
                        );
                      }}
                      onStatusChange={handleTaskStatusChange}
                      statuses={activeProject.statuses}
                      tasks={filteredTasks}
                    />
                  </Flex>
                </Flex>
              )}
            </Card>
          </Flex>
        </Layout.Content>
      </Layout>

      <ProjectFormModal
        initialValues={
          projectEditorMode === "edit" && projectDraft
            ? {
                name: projectDraft.name,
                description: projectDraft.description,
              }
            : undefined
        }
        mode={projectEditorMode}
        onCancel={() => {
          setProjectModalOpen(false);
          setProjectDraft(null);
        }}
        onSubmit={(values) => {
          if (projectEditorMode === "create") {
            createProject({
              name: values.name,
              description: values.description,
              statuses: DEFAULT_STATUS_TEMPLATES[language],
            });
          } else if (projectDraft) {
            updateProject(projectDraft.id, values);
          }

          setProjectModalOpen(false);
          setProjectDraft(null);
        }}
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
        onCancel={() => {
          setStatusModalOpen(false);
          setStatusDraft(null);
        }}
        onSubmit={(values) => {
          if (!activeProject) {
            return;
          }

          if (statusEditorMode === "create") {
            addStatus(activeProject.id, values);
          } else if (statusDraft) {
            updateStatus(activeProject.id, statusDraft.id, values);
          }

          setStatusModalOpen(false);
          setStatusDraft(null);
        }}
        open={isStatusModalOpen}
      />

      <TaskEditorDrawer
        initialTask={taskEditorMode === "edit" ? editingTask : null}
        mode={taskEditorMode}
        onClose={() => {
          setTaskDrawerOpen(false);
          setEditingTaskId(null);
          setTaskEditorMode("create");
          closeTaskDetails();
        }}
        onSubmit={(values) => {
          if (!activeProject) {
            return;
          }

          if (taskEditorMode === "create") {
            createTask(activeProject.id, {
              title: values.title,
              content: values.content,
              tags: values.tags,
              dueDate: values.dueDate,
              statusId: values.statusId || activeProject.statuses[0]?.id || "",
            });
          } else if (editingTaskId) {
            updateTask(activeProject.id, editingTaskId, {
              title: values.title,
              content: values.content,
              tags: values.tags,
              dueDate: values.dueDate,
              statusId: values.statusId,
            });
          }

          setTaskDrawerOpen(false);
          setEditingTaskId(null);
          setTaskEditorMode("create");
          closeTaskDetails();
        }}
        open={isTaskDrawerOpen}
        statuses={activeProject?.statuses ?? []}
        availableTags={activeTaskTags}
      />

      <TaskDetailsDrawer
        onClose={closeTaskDetails}
        open={isTaskDetailsOpen}
        onEdit={(taskId) => {
          closeTaskDetails();
          openTaskEdit(taskId);
        }}
        statuses={activeProject?.statuses ?? []}
        task={viewedTask}
        language={language}
      />

      <Modal
        centered
        onCancel={() => setThemeModalOpen(false)}
        width="min(520px, 95vw)"
        open={isThemeModalOpen}
        footer={null}
        styles={{
          wrapper: {
            background: token.colorBgElevated,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
            overflow: "hidden",
          },
          body: {
            background: token.colorBgElevated,
            borderRadius: token.borderRadiusLG,
            padding: 0,
            overflow: "auto",
          },
          footer: {
            borderTop: `1px solid ${token.colorBorderSecondary}`,
          },
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            borderBottom: `1px solid ${token.colorBorder}`,
          }}
        >
          <Space size={8}>
            <SettingOutlined />
            <Typography.Title level={5} style={{ margin: 0 }}>
              {t("theme.settings")}
            </Typography.Title>
          </Space>
          <Typography.Text type="secondary">
            {t("theme.sectionDescription")}
          </Typography.Text>
        </div>

        <ThemeSidebarCard
          onThemeColorsChange={setThemeColors}
          onThemeModeChange={setThemeMode}
          themeColors={themeColors}
          themeMode={themeMode}
        />

        <Divider style={{ margin: 0 }} />

        <Flex justify="end" style={{ padding: 14 }}>
          <Button onClick={() => setThemeModalOpen(false)}>
            {t("actions.close")}
          </Button>
        </Flex>
      </Modal>
    </div>
  );
};
