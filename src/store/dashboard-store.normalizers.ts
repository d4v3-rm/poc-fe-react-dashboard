import type { ProjectItem } from "../features/projects/project.types";
import type { TaskItem, TaskStatus } from "../features/tasks/task.types";
import type { LanguageCode } from "../shared/i18n/i18n.types";
import {
  createInitialSnapshot,
  createStatuses,
} from "./dashboard-store.factories";
import type { DashboardSnapshot } from "./dashboard-store.types";
import {
  mergeProjectTags,
  normalizeThemeColors,
  nowIso,
} from "./dashboard-store.utils";

export const normalizeTaskOrdering = (
  tasks: TaskItem[],
  statuses: TaskStatus[],
): TaskItem[] => {
  if (statuses.length === 0) {
    return [];
  }

  const statusIds = statuses.map((status) => status.id);
  const firstStatusId = statusIds[0];

  const grouped = new Map<string, TaskItem[]>();
  statusIds.forEach((statusId) => grouped.set(statusId, []));

  tasks.forEach((task) => {
    const safeStatusId = grouped.has(task.statusId)
      ? task.statusId
      : firstStatusId;
    const list = grouped.get(safeStatusId);

    if (list) {
      list.push({ ...task, statusId: safeStatusId });
    }
  });

  grouped.forEach((list) => {
    list.sort((first, second) => {
      if (first.order !== second.order) {
        return first.order - second.order;
      }

      return first.createdAt.localeCompare(second.createdAt);
    });
  });

  const normalized: TaskItem[] = [];
  statusIds.forEach((statusId) => {
    const list = grouped.get(statusId) ?? [];

    list.forEach((task, index) => {
      normalized.push({
        ...task,
        order: index,
      });
    });
  });

  return normalized;
};

export const normalizeProject = (
  project: ProjectItem,
  fallbackLanguage: LanguageCode,
): ProjectItem => {
  const timestamp = nowIso();
  const statuses =
    project.statuses.length > 0
      ? project.statuses
      : createStatuses(fallbackLanguage).map((status) => ({
          ...status,
          createdAt: project.createdAt || timestamp,
          updatedAt: project.updatedAt || timestamp,
        }));
  const normalizedTasks = normalizeTaskOrdering(
    project.tasks.map((task) => ({
      ...task,
      tags: task.tags ?? [],
    })),
    statuses,
  );

  return {
    ...project,
    description: project.description ?? "",
    tags: mergeProjectTags(project.tags, normalizedTasks),
    statuses,
    tasks: normalizedTasks,
  };
};

export const normalizeSnapshot = (
  snapshot: DashboardSnapshot,
): DashboardSnapshot => {
  const language = snapshot.language;
  const projects = snapshot.projects.map((project) =>
    normalizeProject(project, language),
  );

  if (projects.length === 0) {
    const initial = createInitialSnapshot();
    return {
      ...initial,
      language,
    };
  }

  const activeProjectId =
    snapshot.activeProjectId &&
    projects.some((project) => project.id === snapshot.activeProjectId)
      ? snapshot.activeProjectId
      : projects[0].id;

  const activeStatuses =
    projects.find((project) => project.id === activeProjectId)?.statuses ?? [];
  const validStatusIds = new Set(activeStatuses.map((status) => status.id));
  const activeProject = projects.find(
    (project) => project.id === activeProjectId,
  );
  const validTagIds = new Set(activeProject?.tags ?? []);

  return {
    projects,
    activeProjectId,
    viewMode: snapshot.viewMode,
    filters: {
      query: snapshot.filters.query,
      statusIds: snapshot.filters.statusIds.filter((statusId) =>
        validStatusIds.has(statusId),
      ),
      tagIds: snapshot.filters.tagIds.filter((tagId) => validTagIds.has(tagId)),
      due: snapshot.filters.due,
    },
    language,
    themeMode: snapshot.themeMode ?? "dark",
    themeColors: normalizeThemeColors(snapshot.themeColors),
  };
};
