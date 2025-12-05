import { App as AntdApp, Card, Col, Empty, Flex, Row, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { DashboardToolbar } from './components/DashboardToolbar';
import { KanbanBoard } from '../features/kanban/components/KanbanBoard';
import { ProjectFormModal } from '../features/projects/components/ProjectFormModal';
import { ProjectSidebar } from '../features/projects/components/ProjectSidebar';
import type { ProjectItem } from '../features/projects/project.types';
import { TaskEditorDrawer } from '../features/tasks/components/TaskEditorDrawer';
import { TaskListView } from '../features/tasks/components/TaskListView';
import { StatusFormModal } from '../features/tasks/components/StatusFormModal';
import type { TaskStatus } from '../features/tasks/task.types';
import { filterTasks } from '../features/tasks/task-filters';
import { DEFAULT_STATUS_TEMPLATES } from '../shared/utils/defaults';
import { dashboardSnapshotSchema } from '../store/dashboard.schema';
import { useDashboardStore } from '../store/dashboard-store';

type TaskEditorMode = 'create' | 'edit';
type ProjectEditorMode = 'create' | 'edit';
type StatusEditorMode = 'create' | 'edit';

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

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) ?? null,
    [activeProjectId, projects],
  );

  const filteredTasks = useMemo(() => {
    if (!activeProject) {
      return [];
    }

    return filterTasks(activeProject.tasks, filters);
  }, [activeProject, filters]);

  const [projectEditorMode, setProjectEditorMode] = useState<ProjectEditorMode>('create');
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [projectDraft, setProjectDraft] = useState<ProjectItem | null>(null);

  const [taskEditorMode, setTaskEditorMode] = useState<TaskEditorMode>('create');
  const [isTaskDrawerOpen, setTaskDrawerOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const [statusEditorMode, setStatusEditorMode] = useState<StatusEditorMode>('create');
  const [isStatusModalOpen, setStatusModalOpen] = useState(false);
  const [statusDraft, setStatusDraft] = useState<TaskStatus | null>(null);

  const importInputRef = useRef<HTMLInputElement>(null);

  const editingTask =
    editingTaskId && activeProject
      ? activeProject.tasks.find((task) => task.id === editingTaskId) ?? null
      : null;

  const openProjectCreate = () => {
    setProjectEditorMode('create');
    setProjectDraft(null);
    setProjectModalOpen(true);
  };

  const openProjectEdit = (project: ProjectItem) => {
    setProjectEditorMode('edit');
    setProjectDraft(project);
    setProjectModalOpen(true);
  };

  const openTaskCreate = () => {
    if (!activeProject) {
      return;
    }

    setTaskEditorMode('create');
    setEditingTaskId(null);
    setTaskDrawerOpen(true);
  };

  const openTaskEdit = (taskId: string) => {
    setTaskEditorMode('edit');
    setEditingTaskId(taskId);
    setTaskDrawerOpen(true);
  };

  const openStatusCreate = () => {
    setStatusEditorMode('create');
    setStatusDraft(null);
    setStatusModalOpen(true);
  };

  const openStatusEdit = (status: TaskStatus) => {
    setStatusEditorMode('edit');
    setStatusDraft(status);
    setStatusModalOpen(true);
  };

  const handleProjectDelete = (project: ProjectItem) => {
    modal.confirm({
      title: t('project.deleteConfirm.title'),
      content: t('project.deleteConfirm.description'),
      okText: t('actions.delete'),
      okType: 'danger',
      cancelText: t('actions.cancel'),
      onOk: () => removeProject(project.id),
    });
  };

  const handleStatusDelete = (status: TaskStatus) => {
    if (!activeProject) {
      return;
    }

    modal.confirm({
      title: t('kanban.deleteStatusConfirm.title'),
      content: t('kanban.deleteStatusConfirm.description'),
      okText: t('actions.delete'),
      okType: 'danger',
      cancelText: t('actions.cancel'),
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
      type: 'application/json',
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `task-dashboard-${dayjs().format('YYYYMMDD-HHmmss')}.json`;
    link.click();
    URL.revokeObjectURL(url);

    void message.success(t('messages.exportReady'));
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
      void message.success(t('messages.importSuccess'));
    } catch {
      void message.error(t('messages.importError'));
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: 14 }}>
      <input
        accept="application/json"
        style={{ display: 'none' }}
        onChange={(event) => {
          void handleImportFile(event);
        }}
        ref={importInputRef}
        type="file"
      />

      <Row gutter={[14, 14]}>
        <Col lg={8} xl={7} xs={24}>
          <Card>
            <ProjectSidebar
              activeProjectId={activeProjectId}
              onCreateProject={openProjectCreate}
              onDeleteProject={handleProjectDelete}
              onEditProject={openProjectEdit}
              onSelectProject={setActiveProject}
              projects={projects}
            />
          </Card>
        </Col>
        <Col lg={16} xl={17} xs={24}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <Card>
              <DashboardToolbar
                filters={filters}
                language={language}
                onClearFilters={clearFilters}
                onCreateTask={openTaskCreate}
                onDueFilterChange={setDueFilter}
                onExport={handleExport}
                onImport={triggerImport}
                onLanguageChange={setLanguage}
                onSearchChange={setFilterQuery}
                onStatusFilterChange={setFilterStatusIds}
                onThemeColorsChange={setThemeColors}
                onThemeModeChange={setThemeMode}
                onViewModeChange={setViewMode}
                statuses={activeProject?.statuses ?? []}
                themeColors={themeColors}
                themeMode={themeMode}
                viewMode={viewMode}
              />
            </Card>

            <Card>
              {activeProject ? (
                <Flex gap={4} vertical>
                  <Typography.Title level={3} style={{ margin: 0 }}>
                    {activeProject.name}
                  </Typography.Title>
                  <Typography.Text type="secondary">
                    {activeProject.description || t('project.form.description')}
                  </Typography.Text>
                </Flex>
              ) : (
                <Typography.Title level={3} style={{ margin: 0 }}>
                  -
                </Typography.Title>
              )}
            </Card>

            <Card style={{ minHeight: 400 }}>
              {!activeProject && (
                <Empty
                  description={t('project.empty')}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  style={{ paddingTop: 36 }}
                />
              )}

              {activeProject && viewMode === 'list' && (
                <TaskListView
                  language={language}
                  onDeleteTask={handleTaskDelete}
                  onEditTask={openTaskEdit}
                  onStatusChange={handleTaskStatusChange}
                  statuses={activeProject.statuses}
                  tasks={filteredTasks}
                />
              )}

              {activeProject && viewMode === 'kanban' && (
                <KanbanBoard
                  language={language}
                  onAddStatus={openStatusCreate}
                  onDeleteStatus={handleStatusDelete}
                  onDeleteTask={handleTaskDelete}
                  onEditStatus={openStatusEdit}
                  onEditTask={openTaskEdit}
                  onMoveTask={(taskId, targetStatusId, targetIndex) => {
                    moveTask(activeProject.id, taskId, targetStatusId, targetIndex);
                  }}
                  onStatusChange={handleTaskStatusChange}
                  statuses={activeProject.statuses}
                  tasks={filteredTasks}
                />
              )}
            </Card>
          </Space>
        </Col>
      </Row>

      <ProjectFormModal
        initialValues={
          projectEditorMode === 'edit' && projectDraft
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
          if (projectEditorMode === 'create') {
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
          statusEditorMode === 'edit' && statusDraft
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

          if (statusEditorMode === 'create') {
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
        initialTask={taskEditorMode === 'edit' ? editingTask : null}
        mode={taskEditorMode}
        onClose={() => {
          setTaskDrawerOpen(false);
          setEditingTaskId(null);
          setTaskEditorMode('create');
        }}
        onSubmit={(values) => {
          if (!activeProject) {
            return;
          }

          if (taskEditorMode === 'create') {
            createTask(activeProject.id, {
              title: values.title,
              content: values.content,
              dueDate: values.dueDate,
              statusId: values.statusId || activeProject.statuses[0]?.id || '',
            });
          } else if (editingTaskId) {
            updateTask(activeProject.id, editingTaskId, {
              title: values.title,
              content: values.content,
              dueDate: values.dueDate,
              statusId: values.statusId,
            });
          }

          setTaskDrawerOpen(false);
          setEditingTaskId(null);
          setTaskEditorMode('create');
        }}
        open={isTaskDrawerOpen}
        statuses={activeProject?.statuses ?? []}
      />
    </div>
  );
};
