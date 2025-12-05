import type { ProjectItem } from "../features/projects/project.types";
import type { TaskItem } from "../features/tasks/task.types";
import { createId } from "../shared/utils/id";
import { normalizeTaskOrdering } from "./dashboard-store.normalizers";
import { updateProjectCollection } from "./dashboard-store.projects";
import type {
  CreateTaskInput,
  DashboardSnapshot,
  UpdateTaskInput,
} from "./dashboard-store.types";
import {
  mergeProjectTags,
  normalizeTagList,
  nowIso,
} from "./dashboard-store.utils";

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
  const normalizedTags = normalizeTagList(input.tags);
  const updatedTasks = baseProject.tasks.map((task) => {
    if (task.id !== taskId) {
      return task;
    }

    return {
      ...task,
      title: input.title.trim(),
      content: input.content.trim(),
      tags: normalizedTags,
      dueDate: input.dueDate,
      statusId: safeStatusId,
      updatedAt: timestamp,
    };
  });

  return {
    ...baseProject,
    updatedAt: timestamp,
    tasks: updatedTasks,
    tags: mergeProjectTags(baseProject.tags, updatedTasks),
  };
};

export const createTaskState = (
  state: DashboardSnapshot,
  projectId: string,
  input: CreateTaskInput,
): {
  createdId: string;
  nextState: Pick<DashboardSnapshot, "projects">;
} => {
  let createdId = "";

  return {
    createdId,
    nextState: {
      projects: updateProjectCollection(
        state.projects,
        projectId,
        (project) => {
          const fallbackStatusId = project.statuses[0]?.id;
          const safeStatusId =
            project.statuses.some((status) => status.id === input.statusId) &&
            input.statusId
              ? input.statusId
              : fallbackStatusId;

          if (!safeStatusId) {
            return project;
          }

          const timestamp = nowIso();
          const order = project.tasks.filter(
            (task) => task.statusId === safeStatusId,
          ).length;
          const normalizedTags = normalizeTagList(input.tags);

          const task: TaskItem = {
            id: createId(),
            title: input.title.trim(),
            content: input.content.trim(),
            tags: normalizedTags,
            statusId: safeStatusId,
            dueDate: input.dueDate,
            order,
            createdAt: timestamp,
            updatedAt: timestamp,
          };

          createdId = task.id;
          const nextTasks = normalizeTaskOrdering(
            [...project.tasks, task],
            project.statuses,
          );

          return {
            ...project,
            updatedAt: timestamp,
            tasks: nextTasks,
            tags: mergeProjectTags(project.tags, nextTasks),
          };
        },
      ),
    },
  };
};

export const updateTaskState = (
  state: DashboardSnapshot,
  projectId: string,
  taskId: string,
  input: UpdateTaskInput,
): Pick<DashboardSnapshot, "projects"> => ({
  projects: updateProjectCollection(state.projects, projectId, (project) =>
    updateTaskDetails(project, taskId, input),
  ),
});

export const removeTaskState = (
  state: DashboardSnapshot,
  projectId: string,
  taskId: string,
): Pick<DashboardSnapshot, "projects"> => ({
  projects: updateProjectCollection(state.projects, projectId, (project) => {
    const timestamp = nowIso();
    const nextTasks = normalizeTaskOrdering(
      project.tasks.filter((task) => task.id !== taskId),
      project.statuses,
    );

    return {
      ...project,
      updatedAt: timestamp,
      tasks: nextTasks,
      tags: mergeProjectTags(project.tags, nextTasks),
    };
  }),
});

export const moveTaskState = (
  state: DashboardSnapshot,
  projectId: string,
  taskId: string,
  targetStatusId: string,
  targetIndex?: number,
): Pick<DashboardSnapshot, "projects"> => ({
  projects: updateProjectCollection(state.projects, projectId, (project) =>
    moveTaskInProject(project, taskId, targetStatusId, targetIndex),
  ),
});
