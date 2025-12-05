import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProjectItem } from "../features/projects/project.types";
import type {
  LanguageCode,
  TaskItem,
  TaskStatus,
} from "../features/tasks/task.types";
import {
  DEFAULT_PROJECT_NAME,
  DEFAULT_STATUS_TEMPLATES,
  DEFAULT_THEME_COLORS,
} from "../shared/utils/defaults";
import { createId } from "../shared/utils/id";
import { buildMockProjects } from "../shared/utils/mock-data";
import { dashboardSnapshotSchema } from "./dashboard.schema";
import type {
  CreateProjectInput,
  DashboardSnapshot,
  DashboardStore,
  ThemeColors,
  UpdateTaskInput,
} from "./dashboard-store.types";

const STORAGE_KEY = "task-dashboard-v1";
const STORAGE_VERSION = 1;
const HEX_COLOR_PATTERN = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const nowIso = (): string => new Date().toISOString();

const detectLanguage = (): LanguageCode => {
  if (
    typeof navigator !== "undefined" &&
    navigator.language.toLowerCase().startsWith("it")
  ) {
    return "it";
  }

  return "en";
};

const normalizeThemeColors = (
  colors: Partial<ThemeColors> | undefined,
): ThemeColors => {
  const primary =
    colors?.primary && HEX_COLOR_PATTERN.test(colors.primary)
      ? colors.primary
      : DEFAULT_THEME_COLORS.primary;
  const secondary =
    colors?.secondary && HEX_COLOR_PATTERN.test(colors.secondary)
      ? colors.secondary
      : DEFAULT_THEME_COLORS.secondary;

  return {
    primary,
    secondary,
  };
};

const createStatuses = (
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

const normalizeTaskOrdering = (
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

const normalizeProject = (
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

  return {
    ...project,
    description: project.description ?? "",
    statuses,
    tasks: normalizeTaskOrdering(
      project.tasks.map((task) => ({
        ...task,
        tags: task.tags ?? [],
      })),
      statuses,
    ),
  };
};

const createProjectEntity = (
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
    statuses: createStatuses(language, input.statuses),
    tasks: [],
  };
};

const createInitialSnapshot = (): DashboardSnapshot => {
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
    filters: {
      query: "",
      statusIds: [],
      tagIds: [],
      due: "all",
    },
    language,
    themeMode: "light",
    themeColors: DEFAULT_THEME_COLORS,
  };
};

const normalizeSnapshot = (snapshot: DashboardSnapshot): DashboardSnapshot => {
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
  const validTagIds = new Set(
    (activeProject?.tasks ?? []).flatMap((task) => task.tags),
  );

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
    themeMode: snapshot.themeMode ?? "light",
    themeColors: normalizeThemeColors(snapshot.themeColors),
  };
};

const hasTaskData = (projects: ProjectItem[]): boolean =>
  projects.some((project) => project.tasks.length > 0);

const createMockSnapshotFromPreferences = (
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

const updateProjectCollection = (
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

const moveTaskInProject = (
  project: ProjectItem,
  taskId: string,
  targetStatusId: string,
  targetIndex?: number,
): ProjectItem => {
  if (!project.statuses.some((status) => status.id === targetStatusId)) {
    return project;
  }

  const tasks = normalizeTaskOrdering(project.tasks, project.statuses);
  const movingTask = tasks.find((task) => task.id === taskId);

  if (!movingTask) {
    return project;
  }

  const grouped = new Map<string, TaskItem[]>();
  project.statuses.forEach((status) => grouped.set(status.id, []));

  tasks.forEach((task) => {
    if (task.id === taskId) {
      return;
    }

    const list = grouped.get(task.statusId);
    list?.push(task);
  });

  const destination = grouped.get(targetStatusId) ?? [];
  const safeIndex =
    typeof targetIndex === "number"
      ? Math.min(Math.max(targetIndex, 0), destination.length)
      : destination.length;

  const timestamp = nowIso();
  const movedTask: TaskItem = {
    ...movingTask,
    statusId: targetStatusId,
    updatedAt: timestamp,
  };

  destination.splice(safeIndex, 0, movedTask);
  grouped.set(targetStatusId, destination);

  const nextTasks: TaskItem[] = [];

  project.statuses.forEach((status) => {
    const list = grouped.get(status.id) ?? [];

    list.forEach((task, index) => {
      nextTasks.push({
        ...task,
        order: index,
      });
    });
  });

  return {
    ...project,
    tasks: nextTasks,
    updatedAt: timestamp,
  };
};

const updateTaskDetails = (
  project: ProjectItem,
  taskId: string,
  input: UpdateTaskInput,
): ProjectItem => {
  const existingTask = project.tasks.find((task) => task.id === taskId);

  if (!existingTask) {
    return project;
  }

  const fallbackStatusId = project.statuses[0]?.id;
  const safeStatusId =
    project.statuses.some((status) => status.id === input.statusId) &&
    input.statusId
      ? input.statusId
      : fallbackStatusId;

  if (!safeStatusId) {
    return project;
  }

  const baseProject =
    existingTask.statusId !== safeStatusId
      ? moveTaskInProject(project, taskId, safeStatusId)
      : project;

  const timestamp = nowIso();

  return {
    ...baseProject,
    updatedAt: timestamp,
    tasks: baseProject.tasks.map((task) => {
      if (task.id !== taskId) {
        return task;
      }

      return {
        ...task,
        title: input.title.trim(),
        content: input.content.trim(),
        tags: input.tags,
        dueDate: input.dueDate,
        statusId: safeStatusId,
        updatedAt: timestamp,
      };
    }),
  };
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      ...createInitialSnapshot(),
      setActiveProject: (projectId) => {
        set((state) => {
          const targetProject = state.projects.find(
            (project) => project.id === projectId,
          );

          if (!targetProject) {
            return state;
          }

          const validStatusIds = new Set(
            targetProject.statuses.map((status) => status.id),
          );
          const validTagIds = new Set(
            targetProject.tasks.flatMap((task) => task.tags),
          );

          return {
            activeProjectId: projectId,
            filters: {
              ...state.filters,
              statusIds: state.filters.statusIds.filter((statusId) =>
                validStatusIds.has(statusId),
              ),
              tagIds: state.filters.tagIds.filter((tagId) =>
                validTagIds.has(tagId),
              ),
            },
          };
        });
      },
      setViewMode: (mode) => {
        set({ viewMode: mode });
      },
      setFilterQuery: (query) => {
        set((state) => ({
          filters: {
            ...state.filters,
            query,
          },
        }));
      },
      setFilterStatusIds: (statusIds) => {
        set((state) => ({
          filters: {
            ...state.filters,
            statusIds,
          },
        }));
      },
      setFilterTagIds: (tagIds) => {
        set((state) => ({
          filters: {
            ...state.filters,
            tagIds,
          },
        }));
      },
      setDueFilter: (due) => {
        set((state) => ({
          filters: {
            ...state.filters,
            due,
          },
        }));
      },
      clearFilters: () => {
        set((state) => ({
          filters: {
            ...state.filters,
            query: "",
            statusIds: [],
            tagIds: [],
            due: "all",
          },
        }));
      },
      setLanguage: (language) => {
        set({ language });
      },
      setThemeMode: (themeMode) => {
        set({ themeMode });
      },
      setThemeColors: (themeColors) => {
        set({
          themeColors: normalizeThemeColors(themeColors),
        });
      },
      createProject: (input) => {
        const trimmedName = input.name.trim();

        if (!trimmedName) {
          return "";
        }

        let createdId = "";

        set((state) => {
          const project = createProjectEntity(state.language, {
            ...input,
            name: trimmedName,
          });

          createdId = project.id;

          return {
            projects: [...state.projects, project],
            activeProjectId: project.id,
            filters: {
              ...state.filters,
              statusIds: [],
              tagIds: [],
            },
          };
        });

        return createdId;
      },
      updateProject: (projectId, input) => {
        set((state) => ({
          projects: updateProjectCollection(
            state.projects,
            projectId,
            (project) => ({
              ...project,
              name: input.name.trim(),
              description: input.description?.trim() ?? "",
              updatedAt: nowIso(),
            }),
          ),
        }));
      },
      removeProject: (projectId) => {
        set((state) => {
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
            remaining.find((project) => project.id === nextActiveProjectId)
              ?.statuses ?? [];
          const statusIds = new Set(
            activeProjectStatuses.map((status) => status.id),
          );

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
        });
      },
      createTask: (projectId, input) => {
        let createdId = "";

        set((state) => ({
          projects: updateProjectCollection(
            state.projects,
            projectId,
            (project) => {
              const fallbackStatusId = project.statuses[0]?.id;
              const safeStatusId =
                project.statuses.some(
                  (status) => status.id === input.statusId,
                ) && input.statusId
                  ? input.statusId
                  : fallbackStatusId;

              if (!safeStatusId) {
                return project;
              }

              const timestamp = nowIso();
              const order = project.tasks.filter(
                (task) => task.statusId === safeStatusId,
              ).length;

              const task: TaskItem = {
                id: createId(),
                title: input.title.trim(),
                content: input.content.trim(),
                tags: input.tags,
                statusId: safeStatusId,
                dueDate: input.dueDate,
                order,
                createdAt: timestamp,
                updatedAt: timestamp,
              };

              createdId = task.id;

              return {
                ...project,
                updatedAt: timestamp,
                tasks: [...project.tasks, task],
              };
            },
          ),
        }));

        return createdId;
      },
      updateTask: (projectId, taskId, input) => {
        set((state) => ({
          projects: updateProjectCollection(
            state.projects,
            projectId,
            (project) => updateTaskDetails(project, taskId, input),
          ),
        }));
      },
      removeTask: (projectId, taskId) => {
        set((state) => ({
          projects: updateProjectCollection(
            state.projects,
            projectId,
            (project) => {
              const timestamp = nowIso();
              const nextTasks = project.tasks.filter(
                (task) => task.id !== taskId,
              );

              return {
                ...project,
                updatedAt: timestamp,
                tasks: normalizeTaskOrdering(nextTasks, project.statuses),
              };
            },
          ),
        }));
      },
      moveTask: (projectId, taskId, targetStatusId, targetIndex) => {
        set((state) => ({
          projects: updateProjectCollection(
            state.projects,
            projectId,
            (project) =>
              moveTaskInProject(project, taskId, targetStatusId, targetIndex),
          ),
        }));
      },
      addStatus: (projectId, input) => {
        let createdStatusId = "";

        set((state) => ({
          projects: updateProjectCollection(
            state.projects,
            projectId,
            (project) => {
              const timestamp = nowIso();
              const status: TaskStatus = {
                id: createId(),
                name: input.name.trim(),
                color: input.color,
                createdAt: timestamp,
                updatedAt: timestamp,
              };

              createdStatusId = status.id;

              return {
                ...project,
                updatedAt: timestamp,
                statuses: [...project.statuses, status],
              };
            },
          ),
        }));

        return createdStatusId;
      },
      updateStatus: (projectId, statusId, input) => {
        set((state) => ({
          projects: updateProjectCollection(
            state.projects,
            projectId,
            (project) => ({
              ...project,
              updatedAt: nowIso(),
              statuses: project.statuses.map((status) => {
                if (status.id !== statusId) {
                  return status;
                }

                return {
                  ...status,
                  name: input.name.trim(),
                  color: input.color,
                  updatedAt: nowIso(),
                };
              }),
            }),
          ),
        }));
      },
      removeStatus: (projectId, statusId) => {
        set((state) => ({
          projects: updateProjectCollection(
            state.projects,
            projectId,
            (project) => {
              if (project.statuses.length <= 1) {
                return project;
              }

              const remainingStatuses = project.statuses.filter(
                (status) => status.id !== statusId,
              );
              const fallbackStatusId = remainingStatuses[0].id;
              const timestamp = nowIso();

              const reassigned = project.tasks.map((task) => {
                if (task.statusId !== statusId) {
                  return task;
                }

                return {
                  ...task,
                  statusId: fallbackStatusId,
                  updatedAt: timestamp,
                };
              });

              return {
                ...project,
                updatedAt: timestamp,
                statuses: remainingStatuses,
                tasks: normalizeTaskOrdering(reassigned, remainingStatuses),
              };
            },
          ),
          filters: {
            ...state.filters,
            statusIds: state.filters.statusIds.filter((id) => id !== statusId),
          },
        }));
      },
      importSnapshot: (snapshot) => {
        const parsed = dashboardSnapshotSchema.safeParse(snapshot);

        if (!parsed.success) {
          return;
        }

        const normalized = normalizeSnapshot(parsed.data);
        set(normalized);
      },
      getSnapshot: () => {
        const state = get();

        return {
          projects: state.projects,
          activeProjectId: state.activeProjectId,
          viewMode: state.viewMode,
          filters: state.filters,
          language: state.language,
          themeMode: state.themeMode,
          themeColors: state.themeColors,
        };
      },
      getActiveProject: () => {
        const state = get();
        return (
          state.projects.find(
            (project) => project.id === state.activeProjectId,
          ) ?? null
        );
      },
      getTaskById: (taskId) => {
        const state = get();

        for (const project of state.projects) {
          const task = project.tasks.find((entry) => entry.id === taskId);

          if (task) {
            return task;
          }
        }

        return null;
      },
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version) => {
        const parsed = dashboardSnapshotSchema.safeParse(persistedState);

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
        projects: state.projects,
        activeProjectId: state.activeProjectId,
        viewMode: state.viewMode,
        filters: state.filters,
        language: state.language,
        themeMode: state.themeMode,
        themeColors: state.themeColors,
      }),
      merge: (persistedState, currentState) => {
        const parsed = dashboardSnapshotSchema.safeParse(persistedState);

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
