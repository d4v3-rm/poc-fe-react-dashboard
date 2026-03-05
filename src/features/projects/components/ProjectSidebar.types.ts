import type { ProjectItem } from "../project.types";

export type ProjectSidebarProps = {
  projects: ProjectItem[];
  activeProjectId: string | null;
  showHeader?: boolean;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (project: ProjectItem) => void;
};
