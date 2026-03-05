import { DEFAULT_PROJECT_NAME } from "../features/projects/project.defaults";
import type { ProjectItem } from "../features/projects/project.types";
import { createProjectEntity } from "./dashboard-store.factories";
import type {
  CreateProjectInput,
  DashboardSnapshot,
  UpdateProjectInput,
} from "./dashboard-store.types";
import { mergeProjectTags, nowIso } from "./dashboard-store.utils";

export const updateProjectCollection = (
  projects: ProjectItem[],
  projectId: string,
  updater: (project: ProjectItem) => ProjectItem,
): ProjectItem[] =>
  projects.map((project) => {
    if (project.id !== projectId) {
      return project;
    }

    return updater(project);
  });

export const createProjectState = (
  state: DashboardSnapshot,
  input: CreateProjectInput,
): {
  createdId: string;
  nextState: Pick<
    DashboardSnapshot,
    "projects" | "activeProjectId" | "filters"
  >;
} => {
  const project = createProjectEntity(state.language, input);

  return {
    createdId: project.id,
    nextState: {
      projects: [...state.projects, project],
      activeProjectId: project.id,
      filters: {
        ...state.filters,
        statusIds: [],
        tagIds: [],
      },
    },
  };
};

export const updateProjectState = (
  state: DashboardSnapshot,
  projectId: string,
  input: UpdateProjectInput,
): Pick<DashboardSnapshot, "projects"> => ({
  projects: updateProjectCollection(state.projects, projectId, (project) => ({
    ...project,
    name: input.name.trim(),
    description: input.description?.trim() ?? "",
    tags: mergeProjectTags(input.tags ?? project.tags, project.tasks),
    updatedAt: nowIso(),
  })),
});

export const removeProjectState = (
  state: DashboardSnapshot,
  projectId: string,
): Pick<DashboardSnapshot, "projects" | "activeProjectId" | "filters"> => {
  const remaining = state.projects.filter(
    (project) => project.id !== projectId,
  );

  if (remaining.length === 0) {
    const project = createProjectEntity(state.language, {
      name: DEFAULT_PROJECT_NAME[state.language],
      description: "",
    });

    return {
      projects: [project],
      activeProjectId: project.id,
      filters: {
        ...state.filters,
        statusIds: [],
        tagIds: [],
      },
    };
  }

  const nextActiveProjectId =
    state.activeProjectId === projectId
      ? remaining[0].id
      : state.activeProjectId;
  const activeProjectStatuses =
    remaining.find((project) => project.id === nextActiveProjectId)?.statuses ??
    [];
  const statusIds = new Set(activeProjectStatuses.map((status) => status.id));

  return {
    projects: remaining,
    activeProjectId: nextActiveProjectId,
    filters: {
      ...state.filters,
      statusIds: state.filters.statusIds.filter((statusId) =>
        statusIds.has(statusId),
      ),
      tagIds: [],
    },
  };
};
