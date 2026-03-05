import type { TaskStatus } from "../features/tasks/task.types";
import { createId } from "../shared/utils/id";
import { normalizeTaskOrdering } from "./dashboard-store.normalizers";
import { updateProjectCollection } from "./dashboard-store.projects";
import type {
  CreateStatusInput,
  DashboardSnapshot,
  UpdateStatusInput,
} from "./dashboard-store.types";
import { nowIso } from "./dashboard-store.utils";

export const addStatusState = (
  state: DashboardSnapshot,
  projectId: string,
  input: CreateStatusInput,
): {
  createdStatusId: string;
  nextState: Pick<DashboardSnapshot, "projects">;
} => {
  let createdStatusId = "";

  return {
    createdStatusId,
    nextState: {
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
    },
  };
};

export const updateStatusState = (
  state: DashboardSnapshot,
  projectId: string,
  statusId: string,
  input: UpdateStatusInput,
): Pick<DashboardSnapshot, "projects"> => ({
  projects: updateProjectCollection(state.projects, projectId, (project) => ({
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
  })),
});

export const removeStatusState = (
  state: DashboardSnapshot,
  projectId: string,
  statusId: string,
): Pick<DashboardSnapshot, "projects" | "filters"> => ({
  projects: updateProjectCollection(state.projects, projectId, (project) => {
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
  }),
  filters: {
    ...state.filters,
    statusIds: state.filters.statusIds.filter((id) => id !== statusId),
  },
});
