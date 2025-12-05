import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { dashboardStoreSnapshotSchema } from "./dashboard-store.schema";
import { STORAGE_KEY, STORAGE_VERSION } from "./dashboard-store.constants";
import {
  createInitialSnapshot,
  createMockSnapshotFromPreferences,
} from "./dashboard-store.factories";
import { normalizeSnapshot } from "./dashboard-store.normalizers";
import {
  clearFiltersState,
  selectActiveProjectState,
  setDueFilterState,
  setFilterQueryState,
  setFilterStatusIdsState,
  setFilterTagIdsState,
  setLanguageState,
  setThemeColorsState,
  setThemeModeState,
  setViewModeState,
} from "./dashboard-store.preferences";
import {
  createProjectState,
  removeProjectState,
  updateProjectState,
} from "./dashboard-store.projects";
import {
  getActiveProjectFromState,
  getSnapshotFromState,
  getTaskByIdFromState,
} from "./dashboard-store.selectors";
import {
  addStatusState,
  removeStatusState,
  updateStatusState,
} from "./dashboard-store.statuses";
import {
  createTaskState,
  moveTaskState,
  removeTaskState,
  updateTaskState,
} from "./dashboard-store.tasks";
import type { DashboardStore } from "./dashboard-store.types";
import { hasTaskData } from "./dashboard-store.utils";

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      ...createInitialSnapshot(),
      setActiveProject: (projectId) => {
        set((state) => selectActiveProjectState(state, projectId));
      },
      setViewMode: (mode) => {
        set(setViewModeState(mode));
      },
      setFilterQuery: (query) => {
        set((state) => setFilterQueryState(state, query));
      },
      setFilterStatusIds: (statusIds) => {
        set((state) => setFilterStatusIdsState(state, statusIds));
      },
      setFilterTagIds: (tagIds) => {
        set((state) => setFilterTagIdsState(state, tagIds));
      },
      setDueFilter: (due) => {
        set((state) => setDueFilterState(state, due));
      },
      clearFilters: () => {
        set((state) => clearFiltersState(state));
      },
      setLanguage: (language) => {
        set(setLanguageState(language));
      },
      setThemeMode: (themeMode) => {
        set(setThemeModeState(themeMode));
      },
      setThemeColors: (themeColors) => {
        set(setThemeColorsState(themeColors));
      },
      createProject: (input) => {
        const trimmedName = input.name.trim();

        if (!trimmedName) {
          return "";
        }

        let createdId = "";

        set((state) => {
          const { createdId: nextCreatedId, nextState } = createProjectState(
            state,
            {
              ...input,
              name: trimmedName,
            },
          );

          createdId = nextCreatedId;
          return nextState;
        });

        return createdId;
      },
      updateProject: (projectId, input) => {
        set((state) => updateProjectState(state, projectId, input));
      },
      removeProject: (projectId) => {
        set((state) => removeProjectState(state, projectId));
      },
      createTask: (projectId, input) => {
        let createdId = "";

        set((state) => {
          const { createdId: nextCreatedId, nextState } = createTaskState(
            state,
            projectId,
            input,
          );

          createdId = nextCreatedId;
          return nextState;
        });

        return createdId;
      },
      updateTask: (projectId, taskId, input) => {
        set((state) => updateTaskState(state, projectId, taskId, input));
      },
      removeTask: (projectId, taskId) => {
        set((state) => removeTaskState(state, projectId, taskId));
      },
      moveTask: (projectId, taskId, targetStatusId, targetIndex) => {
        set((state) =>
          moveTaskState(state, projectId, taskId, targetStatusId, targetIndex),
        );
      },
      addStatus: (projectId, input) => {
        let createdStatusId = "";

        set((state) => {
          const { createdStatusId: nextCreatedStatusId, nextState } =
            addStatusState(state, projectId, input);

          createdStatusId = nextCreatedStatusId;
          return nextState;
        });

        return createdStatusId;
      },
      updateStatus: (projectId, statusId, input) => {
        set((state) => updateStatusState(state, projectId, statusId, input));
      },
      removeStatus: (projectId, statusId) => {
        set((state) => removeStatusState(state, projectId, statusId));
      },
      importSnapshot: (snapshot) => {
        const parsed = dashboardStoreSnapshotSchema.safeParse(snapshot);

        if (!parsed.success) {
          return;
        }

        set(normalizeSnapshot(parsed.data));
      },
      getSnapshot: () => getSnapshotFromState(get()),
      getActiveProject: () => getActiveProjectFromState(get()),
      getTaskById: (taskId) => getTaskByIdFromState(get(), taskId),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version) => {
        const parsed = dashboardStoreSnapshotSchema.safeParse(persistedState);

        if (!parsed.success) {
          return createInitialSnapshot();
        }

        const normalized = normalizeSnapshot(parsed.data);

        if (version < STORAGE_VERSION && !hasTaskData(normalized.projects)) {
          return createMockSnapshotFromPreferences(normalized);
        }

        return normalized;
      },
      partialize: (state) => ({
        ...getSnapshotFromState(state),
      }),
      merge: (persistedState, currentState) => {
        const parsed = dashboardStoreSnapshotSchema.safeParse(persistedState);

        if (!parsed.success) {
          return currentState;
        }

        return {
          ...currentState,
          ...normalizeSnapshot(parsed.data),
        };
      },
    },
  ),
);
