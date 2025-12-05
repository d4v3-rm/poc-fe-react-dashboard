import type { ChangeEvent, RefObject } from "react";
import type { DashboardModalsProps } from "./DashboardModals.types";
import type { DashboardWorkspaceProps } from "./DashboardWorkspace.types";
import type { ProjectPanelBaseProps } from "./ProjectPanel.types";

export type DashboardPageProjectPanelProps = ProjectPanelBaseProps & {
  isCompactLayout: boolean;
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  onOpenThemeSettings: () => void;
};

export type DashboardPageShellProps = {
  importInputRef: RefObject<HTMLInputElement | null>;
  onImportFile: (event: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  projectPanelProps: DashboardPageProjectPanelProps;
  workspaceProps: DashboardWorkspaceProps;
  modalProps: DashboardModalsProps;
};
