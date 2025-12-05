import { DEFAULT_PROJECT_NAME } from "../features/projects/project.defaults";
import type { ProjectItem } from "../features/projects/project.types";
import type { TaskStatus } from "../features/tasks/task.types";
import { DEFAULT_STATUS_TEMPLATES } from "../features/tasks/status.defaults";
import { DEFAULT_THEME_COLORS } from "../features/theme/theme.constants";
import type { LanguageCode } from "../shared/i18n/i18n.types";
import { createId } from "../shared/utils/id";
import { buildMockProjects } from "./dashboard-store.mock-data";
import { createDefaultFilters } from "./dashboard-store.preferences";
import type {
  CreateProjectInput,
  DashboardSnapshot,
} from "./dashboard-store.types";
import {
  normalizeTagList,
  normalizeThemeColors,
  nowIso,
} from "./dashboard-store.utils";

export const detectLanguage = (): LanguageCode => {
  if (
    typeof navigator !== "undefined" &&
    navigator.language.toLowerCase().startsWith("it")
  ) {
    return "it";
  }

  return "en";
};

export const createStatuses = (
  language: LanguageCode,
  templates?: Array<Pick<TaskStatus, "name" | "color">>,
): TaskStatus[] => {
  const source = templates?.length
    ? templates
    : DEFAULT_STATUS_TEMPLATES[language];
  const timestamp = nowIso();

  return source.map((template) => ({
    id: createId(),
    name: template.name,
    color: template.color,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
};

export const createProjectEntity = (
  language: LanguageCode,
  input: CreateProjectInput,
): ProjectItem => {
  const timestamp = nowIso();

  return {
    id: createId(),
    name: input.name.trim(),
    description: input.description?.trim() ?? "",
    createdAt: timestamp,
    updatedAt: timestamp,
    tags: normalizeTagList(input.tags),
    statuses: createStatuses(language, input.statuses),
    tasks: [],
  };
};

export const createInitialSnapshot = (): DashboardSnapshot => {
  const language = detectLanguage();
  const projects = buildMockProjects(language);
  const project =
    projects[0] ??
    createProjectEntity(language, {
      name: DEFAULT_PROJECT_NAME[language],
      description: "",
    });

  return {
    projects: projects.length > 0 ? projects : [project],
    activeProjectId: project.id,
    viewMode: "kanban",
    filters: createDefaultFilters(),
    language,
    themeMode: "dark",
    themeColors: DEFAULT_THEME_COLORS,
  };
};

export const createMockSnapshotFromPreferences = (
  snapshot: DashboardSnapshot,
): DashboardSnapshot => {
  const seeded = createInitialSnapshot();

  return {
    ...seeded,
    viewMode: snapshot.viewMode,
    language: snapshot.language,
    themeMode: snapshot.themeMode,
    themeColors: normalizeThemeColors(snapshot.themeColors),
  };
};
