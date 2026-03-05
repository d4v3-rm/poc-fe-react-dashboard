import type { ProjectItem } from "../features/projects/project.types";
import type { TaskItem } from "../features/tasks/task.types";
import { DEFAULT_THEME_COLORS } from "../features/theme/theme.constants";
import type { ThemeColors } from "../features/theme/theme.types";
import { HEX_COLOR_PATTERN } from "./dashboard-store.constants";

export const nowIso = (): string => new Date().toISOString();

export const normalizeTagList = (tags: string[] = []): string[] =>
  Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0 && tag.length <= 36),
    ),
  ).sort((first, second) => first.localeCompare(second));

export const mergeProjectTags = (
  storedTags: string[] = [],
  tasks: TaskItem[] = [],
): string[] =>
  normalizeTagList([
    ...storedTags,
    ...tasks.flatMap((task) => task.tags ?? []),
  ]);

export const normalizeThemeColors = (
  colors: Partial<ThemeColors> | undefined,
): ThemeColors => {
  const primary =
    colors?.primary && HEX_COLOR_PATTERN.test(colors.primary)
      ? colors.primary
      : DEFAULT_THEME_COLORS.primary;

  return {
    primary,
  };
};

export const hasTaskData = (projects: ProjectItem[]): boolean =>
  projects.some((project) => project.tasks.length > 0);
