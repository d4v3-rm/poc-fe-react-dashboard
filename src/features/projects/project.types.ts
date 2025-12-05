import type { TaskItem, TaskStatus } from '../tasks/task.types';

export type ProjectItem = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  statuses: TaskStatus[];
  tasks: TaskItem[];
};
