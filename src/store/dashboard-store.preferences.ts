import type { ViewMode } from "../app/dashboard.types";
import type { ThemeColors, ThemeMode } from "../features/theme/theme.types";
import type { LanguageCode } from "../shared/i18n/i18n.types";
import type {
  DashboardFilters,
  DashboardSnapshot,
} from "./dashboard-store.types";
import { normalizeThemeColors } from "./dashboard-store.utils";

export const createDefaultFilters = (): DashboardFilters => ({
  query: "",
  statusIds: [],
  tagIds: [],
  due: "all",
});

export const selectActiveProjectState = (
  state: DashboardSnapshot,
  projectId: string,
): Partial<DashboardSnapshot> | DashboardSnapshot => {
  const targetProject = state.projects.find(
    (project) => project.id === projectId,
  );

  if (!targetProject) {
    return state;
  }

  const validStatusIds = new Set(
    targetProject.statuses.map((status) => status.id),
  );
  const validTagIds = new Set(targetProject.tags);

  return {
    activeProjectId: projectId,
    filters: {
      ...state.filters,
      statusIds: state.filters.statusIds.filter((statusId) =>
        validStatusIds.has(statusId),
      ),
      tagIds: state.filters.tagIds.filter((tagId) => validTagIds.has(tagId)),
    },
  };
};

export const setViewModeState = (mode: ViewMode) => ({
  viewMode: mode,
});

export const setFilterQueryState = (
  state: DashboardSnapshot,
  query: string,
): Partial<DashboardSnapshot> => ({
  filters: {
    ...state.filters,
    query,
  },
});

export const setFilterStatusIdsState = (
  state: DashboardSnapshot,
  statusIds: string[],
): Partial<DashboardSnapshot> => ({
  filters: {
    ...state.filters,
    statusIds,
  },
});

export const setFilterTagIdsState = (
  state: DashboardSnapshot,
  tagIds: string[],
): Partial<DashboardSnapshot> => {
  const activeProject = state.projects.find(
    (project) => project.id === state.activeProjectId,
  );
  const validTagIds = new Set(activeProject?.tags ?? []);

  return {
    filters: {
      ...state.filters,
      tagIds: tagIds.filter((tagId) => validTagIds.has(tagId)),
    },
  };
};

export const setDueFilterState = (
  state: DashboardSnapshot,
  due: DashboardFilters["due"],
): Partial<DashboardSnapshot> => ({
  filters: {
    ...state.filters,
    due,
  },
});

export const clearFiltersState = (
  state: DashboardSnapshot,
): Partial<DashboardSnapshot> => ({
  filters: {
    ...state.filters,
    ...createDefaultFilters(),
  },
});

export const setLanguageState = (language: LanguageCode) => ({
  language,
});

export const setThemeModeState = (themeMode: ThemeMode) => ({
  themeMode,
});

export const setThemeColorsState = (themeColors: ThemeColors) => ({
  themeColors: normalizeThemeColors(themeColors),
});
