import { Card, Empty, Layout, Flex } from "antd";
import { useTranslation } from "react-i18next";
import { DashboardToolbar } from "../DashboardToolbar";
import { DashboardWorkspaceContent } from "./DashboardWorkspaceContent";
import type { DashboardWorkspaceProps } from "./DashboardWorkspace.types";

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

          {activeProject && (
            <DashboardWorkspaceContent
              language={language}
              onDeleteStatus={onDeleteStatus}
              onDeleteTask={onDeleteTask}
              onEditStatus={onEditStatus}
              onEditTask={onEditTask}
              onMoveTask={onMoveTask}
              onOpenTaskDetails={onOpenTaskDetails}
              onStatusChange={onStatusChange}
              projectDescription={projectDescription}
              projectName={projectName}
              statuses={projectStatuses}
              tasks={tasks}
              viewMode={viewMode}
            />
          )}
        </Card>
      </Flex>
    </Layout.Content>
  );
};
