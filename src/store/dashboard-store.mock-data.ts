import dayjs from "dayjs";
import type { ProjectItem } from "../features/projects/project.types";
import type { TaskItem, TaskStatus } from "../features/tasks/task.types";
import type { LanguageCode } from "../shared/i18n/i18n.types";
import { createId } from "../shared/utils/id";
import { dashboardMockSeeds } from "./dashboard-store.mock-data.seeds";
import type {
  MockProjectSeed,
  MockTaskSeed,
} from "./dashboard-store.mock-data.types";

const nowIso = (): string => new Date().toISOString();

const createStatusList = (
  language: LanguageCode,
  statuses: MockProjectSeed["statuses"],
  timestamp: string,
): TaskStatus[] =>
  statuses.map((status) => ({
    id: createId(),
    name: status.name[language],
    color: status.color,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

const createTaskList = (
  language: LanguageCode,
  statuses: TaskStatus[],
  tasks: MockTaskSeed[],
): TaskItem[] => {
  const statusOrder = new Map<string, number>();
  statuses.forEach((status) => statusOrder.set(status.id, 0));

  return tasks.map((task, taskIndex) => {
    const status = statuses[task.statusIndex] ?? statuses[0];
    const currentOrder = statusOrder.get(status.id) ?? 0;
    statusOrder.set(status.id, currentOrder + 1);

    const createdAt = dayjs().subtract(taskIndex, "hour").toISOString();

    return {
      id: createId(),
      title: task.title[language],
      content: task.content[language],
      tags: task.tags ?? [],
      statusId: status.id,
      dueDate:
        task.dueInDays === null
          ? null
          : dayjs().add(task.dueInDays, "day").endOf("day").toISOString(),
      order: currentOrder,
      createdAt,
      updatedAt: createdAt,
    };
  });
};

const collectProjectTags = (tasks: TaskItem[], seedTags: string[] = []) => {
  const unique = new Set<string>([
    ...seedTags.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
    ...tasks.flatMap((task) => task.tags),
  ]);

  return Array.from(unique).sort((first, second) =>
    first.localeCompare(second),
  );
};

export const buildMockProjects = (language: LanguageCode): ProjectItem[] =>
  dashboardMockSeeds.map((seed) => {
    const timestamp = nowIso();
    const statuses = createStatusList(language, seed.statuses, timestamp);
    const tasks = createTaskList(language, statuses, seed.tasks);
    const tags = collectProjectTags(tasks, seed.tags);

    return {
      id: createId(),
      name: seed.name[language],
      description: seed.description[language],
      tags,
      createdAt: timestamp,
      updatedAt: timestamp,
      statuses,
      tasks,
    };
  });
