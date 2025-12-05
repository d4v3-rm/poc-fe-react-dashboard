import { ProjectPanelCompact } from "./ProjectPanelCompact";
import { ProjectPanelDesktop } from "./ProjectPanelDesktop";
import type { ProjectPanelProps } from "./ProjectPanel.types";

export const ProjectPanel = ({
  isCompactLayout,
  ...panelProps
}: ProjectPanelProps) =>
  isCompactLayout ? (
    <ProjectPanelCompact {...panelProps} />
  ) : (
    <ProjectPanelDesktop {...panelProps} />
  );
