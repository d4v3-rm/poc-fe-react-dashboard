import type { ChangeEvent, RefObject } from "react";
import type { DashboardSnapshot } from "../../store/dashboard-store.types";

export type UseDashboardTransferActionsParams = {
  importInputRef: RefObject<HTMLInputElement | null>;
  importSnapshot: (snapshot: DashboardSnapshot) => void;
  getSnapshot: () => DashboardSnapshot;
};

export type DashboardImportHandler = (
  event: ChangeEvent<HTMLInputElement>,
) => Promise<void>;
