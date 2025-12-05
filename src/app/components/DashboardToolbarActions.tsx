import {
  AppstoreAddOutlined,
  DownloadOutlined,
  GlobalOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Space, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import type { DashboardToolbarActionsProps } from "./DashboardToolbar.types";

export const DashboardToolbarActions = ({
  viewMode,
  language,
  onLanguageChange,
  onAddStatus,
  statusActionsDisabled = false,
  onImport,
  onExport,
  onCreateTask,
}: DashboardToolbarActionsProps) => {
  const { t } = useTranslation();

  return (
    <Space size={8} wrap>
      <Tooltip
        title={`${t("actions.toggleLanguage")} (${t(`language.${language}`)})`}
      >
        <Button
          aria-label={t("actions.toggleLanguage")}
          icon={<GlobalOutlined />}
          onClick={() => onLanguageChange(language === "en" ? "it" : "en")}
        />
      </Tooltip>

      {viewMode === "kanban" && (
        <Tooltip title={t("kanban.addStatus")}>
          <Button
            aria-label={t("kanban.addStatus")}
            disabled={statusActionsDisabled}
            icon={<AppstoreAddOutlined />}
            onClick={onAddStatus}
          />
        </Tooltip>
      )}

      <Tooltip title={t("actions.import")}>
        <Button
          aria-label={t("actions.import")}
          icon={<UploadOutlined />}
          onClick={onImport}
        />
      </Tooltip>

      <Tooltip title={t("actions.export")}>
        <Button
          aria-label={t("actions.export")}
          icon={<DownloadOutlined />}
          onClick={onExport}
        />
      </Tooltip>

      <Tooltip title={t("task.create")}>
        <Button
          aria-label={t("task.create")}
          icon={<PlusOutlined />}
          onClick={onCreateTask}
          type="primary"
        />
      </Tooltip>
    </Space>
  );
};
