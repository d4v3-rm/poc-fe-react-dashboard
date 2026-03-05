import type { ProjectItem } from "../../../features/projects/project.types";

export type ProjectPanelBaseProps = {
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  projects: ProjectItem[];
  activeProjectId: string | null;
  onOpenThemeSettings: () => void;
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (project: ProjectItem) => void;
};

export type ProjectPanelProps = ProjectPanelBaseProps & {
  isCompactLayout: boolean;
};

export type ProjectIconListProps = Pick<
  ProjectPanelBaseProps,
  "projects" | "activeProjectId" | "onSelectProject"
>;
