import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { createElement } from "react";
import { App as AntdApp, theme } from "antd";
import { useTranslation } from "react-i18next";
import type { ProjectItem } from "../../features/projects/project.types";
import { DEFAULT_STATUS_TEMPLATES } from "../../features/tasks/status.defaults";
import { OVERLAY_MASK_STYLE } from "../../shared/ui/overlay.styles";
import type {
  ProjectFormValues,
  UseDashboardProjectActionsParams,
} from "./useDashboardProjectActions.types";

export const useDashboardProjectActions = ({
  language,
  projectEditorMode,
  projectDraft,
  createProject,
  updateProject,
  removeProject,
  closeProjectModal,
}: UseDashboardProjectActionsParams) => {
  const { modal } = AntdApp.useApp();
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const handleProjectSubmit = (values: ProjectFormValues) => {
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

  const handleProjectDelete = (project: ProjectItem) => {
    modal.confirm({
      centered: true,
      width: "min(460px, 95vw)",
      maskStyle: OVERLAY_MASK_STYLE,
      style: {
        borderRadius: token.borderRadiusLG,
      },
      icon: createElement(DeleteOutlined, {
        style: { color: token.colorError },
      }),
      title: t("project.deleteConfirm.title"),
      content: t("project.deleteConfirm.description"),
      okText: t("actions.delete"),
      okButtonProps: {
        "aria-label": t("actions.delete"),
        icon: createElement(DeleteOutlined),
        danger: true,
      },
      okType: "danger",
      cancelText: t("actions.cancel"),
      cancelButtonProps: {
        "aria-label": t("actions.cancel"),
        icon: createElement(CloseOutlined),
      },
      onOk: () => {
        removeProject(project.id);
      },
    });
  };

  return {
    handleProjectSubmit,
    handleProjectDelete,
  };
};
