import { Layout } from "antd";
import { DashboardModals } from "./DashboardModals";
import { DashboardWorkspace } from "./DashboardWorkspace";
import { ProjectPanel } from "./ProjectPanel";
import type { DashboardPageShellProps } from "./DashboardPageShell.types";

export const DashboardPageShell = ({
  importInputRef,
  onImportFile,
  projectPanelProps,
  workspaceProps,
  modalProps,
}: DashboardPageShellProps) => {
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
          void onImportFile(event);
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
        <ProjectPanel {...projectPanelProps} />
        <DashboardWorkspace {...workspaceProps} />
      </Layout>

      <DashboardModals {...modalProps} />
    </div>
  );
};
