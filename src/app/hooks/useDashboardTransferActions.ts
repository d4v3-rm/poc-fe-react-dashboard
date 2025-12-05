import { App as AntdApp } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { dashboardStoreSnapshotSchema } from "../../store/dashboard-store.schema";
import type {
  DashboardImportHandler,
  UseDashboardTransferActionsParams,
} from "./useDashboardTransferActions.types";

export const useDashboardTransferActions = ({
  importInputRef,
  importSnapshot,
  getSnapshot,
}: UseDashboardTransferActionsParams) => {
  const { message } = AntdApp.useApp();
  const { t } = useTranslation();

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

  const handleImportFile: DashboardImportHandler = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      const parsedJson = JSON.parse(content);
      const validated = dashboardStoreSnapshotSchema.parse(parsedJson);
      importSnapshot(validated);
      void message.success(t("messages.importSuccess"));
    } catch {
      void message.error(t("messages.importError"));
    } finally {
      event.target.value = "";
    }
  };

  return {
    handleExport,
    triggerImport,
    handleImportFile,
  };
};
