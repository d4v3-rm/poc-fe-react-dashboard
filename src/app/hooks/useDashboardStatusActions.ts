import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { createElement } from "react";
import { App as AntdApp, theme } from "antd";
import { useTranslation } from "react-i18next";
import type { TaskStatus } from "../../features/tasks/task.types";
import { OVERLAY_MASK_STYLE } from "../../shared/ui/overlay.styles";
import type {
  StatusFormValues,
  UseDashboardStatusActionsParams,
} from "./useDashboardStatusActions.types";

export const useDashboardStatusActions = ({
  activeProject,
  statusEditorMode,
  statusDraft,
  addStatus,
  updateStatus,
  removeStatus,
  closeStatusModal,
}: UseDashboardStatusActionsParams) => {
  const { modal } = AntdApp.useApp();
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const handleStatusSubmit = (values: StatusFormValues) => {
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

  const handleStatusDelete = (status: TaskStatus) => {
    if (!activeProject) {
      return;
    }

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
      title: t("kanban.deleteStatusConfirm.title"),
      content: t("kanban.deleteStatusConfirm.description"),
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
        removeStatus(activeProject.id, status.id);
      },
    });
  };

  return {
    handleStatusSubmit,
    handleStatusDelete,
  };
};
