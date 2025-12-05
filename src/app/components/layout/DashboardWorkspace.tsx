import { Card, Empty, Layout, Flex, Typography } from "antd";
import { useTranslation } from "react-i18next";
import type {
  LanguageCode,
  TaskStatus,
  ViewMode,
  TaskItem,
} from "../../../features/tasks/task.types";
import type { ProjectItem } from "../../../features/projects/project.types";
import type { TaskFilters } from "../../../store/dashboard-store.types";
import { DashboardToolbar } from "../DashboardToolbar";
import { KanbanBoard } from "../../../features/kanban/components/KanbanBoard";
import { TaskListView } from "../../../features/tasks/components/TaskListView";

type DashboardWorkspaceProps = {
  activeProject: ProjectItem | null;
  viewMode: ViewMode;
  filters: TaskFilters;
  language: LanguageCode;
  availableTags: string[];
  onClearFilters: () => void;
  onCreateTask: () => void;
  onDueFilterChange: (due: TaskFilters["due"]) => void;
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

export const DashboardWorkspace = ({
  activeProject,
  viewMode,
  filters,
  language,
  availableTags,
  onClearFilters,
  onCreateTask,
  onDueFilterChange,
  onLanguageChange,
  onSearchChange,
  onStatusFilterChange,
  onTagFilterChange,
  onViewModeChange,
  onAddStatus,
  onOpenTaskDetails,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onMoveTask,
  onEditStatus,
  onDeleteStatus,
  onExport,
  onImport,
  tasks,
  statusActionsDisabled,
}: DashboardWorkspaceProps) => {
  const { t } = useTranslation();
  const projectStatuses = activeProject?.statuses ?? [];
  const projectName = activeProject?.name ?? t("project.sectionTitle");
  const projectDescription =
    activeProject?.description || t("project.form.description");

  return (
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
            availableTags={availableTags}
            onClearFilters={onClearFilters}
            onCreateTask={onCreateTask}
            onDueFilterChange={onDueFilterChange}
            onExport={onExport}
            onImport={onImport}
            onLanguageChange={onLanguageChange}
            onSearchChange={onSearchChange}
            onStatusFilterChange={onStatusFilterChange}
            onTagFilterChange={onTagFilterChange}
            onViewModeChange={onViewModeChange}
            statuses={projectStatuses}
            viewMode={viewMode}
            onAddStatus={onAddStatus}
            statusActionsDisabled={statusActionsDisabled}
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
                  {projectName}
                </Typography.Title>
                <Typography.Text type="secondary">
                  {projectDescription}
                </Typography.Text>
              </Flex>

              <Flex
                style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
                vertical
              >
                <TaskListView
                  language={language}
                  onDeleteTask={onDeleteTask}
                  onEditTask={onEditTask}
                  onStatusChange={onStatusChange}
                  onOpenTaskDetails={onOpenTaskDetails}
                  statuses={projectStatuses}
                  tasks={tasks}
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
                  {projectName}
                </Typography.Title>
                <Typography.Text type="secondary">
                  {projectDescription}
                </Typography.Text>
              </Flex>

              <Flex
                style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
                vertical
              >
                <KanbanBoard
                  language={language}
                  onDeleteStatus={onDeleteStatus}
                  onDeleteTask={onDeleteTask}
                  onEditStatus={onEditStatus}
                  onEditTask={onEditTask}
                  onOpenTaskDetails={onOpenTaskDetails}
                  onMoveTask={onMoveTask}
                  onStatusChange={onStatusChange}
                  statuses={projectStatuses}
                  tasks={tasks}
                />
              </Flex>
            </Flex>
          )}
        </Card>
      </Flex>
    </Layout.Content>
  );
};
