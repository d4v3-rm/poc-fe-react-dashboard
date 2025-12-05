import { Button, Divider, Flex, Modal, Typography, theme } from "antd";
import type { ProjectItem } from "../../../features/projects/project.types";
import { ProjectFormModal } from "../../../features/projects/components/ProjectFormModal";
import { StatusFormModal } from "../../../features/tasks/components/StatusFormModal";
import type {
  TaskEditorMode,
  ProjectEditorMode,
  StatusEditorMode,
} from "../../hooks/useDashboardDialogs";
import type { TaskItem, TaskStatus } from "../../../features/tasks/task.types";
import { TaskDetailsDrawer } from "../../../features/tasks/components/TaskDetailsDrawer";
import { TaskEditorDrawer } from "../../../features/tasks/components/TaskEditorDrawer";
import { ThemeSidebarCard } from "../ThemeSidebarCard";
import { useTranslation } from "react-i18next";

type DashboardModalsProps = {
  language: "en" | "it";
  themeMode: "light" | "dark";
  themeColors: {
    primary: string;
  };
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
  onThemeModeChange: (mode: "light" | "dark") => void;
  onThemeColorsChange: (colors: { primary: string }) => void;
};

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
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const overlayMaskStyle = {
    backgroundColor: "rgba(12, 22, 38, 0.44)",
    backdropFilter: "blur(2px)",
  };

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

      <Modal
        centered
        onCancel={onThemeClose}
        width="min(520px, 95vw)"
        open={isThemeModalOpen}
        footer={null}
        styles={{
          mask: overlayMaskStyle,
          container: {
            background: token.colorBgContainer,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
            overflow: "hidden",
          },
          body: {
            background: token.colorBgContainer,
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
          <Flex align="center" gap={8}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              {t("theme.settings")}
            </Typography.Title>
          </Flex>
          <Typography.Text type="secondary">
            {t("theme.sectionDescription")}
          </Typography.Text>
        </div>

        <div style={{ padding: 16 }}>
          <ThemeSidebarCard
            onThemeColorsChange={onThemeColorsChange}
            onThemeModeChange={onThemeModeChange}
            themeColors={themeColors}
            themeMode={themeMode}
          />
        </div>

        <Divider style={{ margin: 0 }} />

        <Flex justify="end" style={{ padding: 14 }}>
          <Button onClick={onThemeClose}>{t("actions.close")}</Button>
        </Flex>
      </Modal>
    </>
  );
};
