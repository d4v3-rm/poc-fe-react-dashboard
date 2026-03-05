export type TaskStatus = {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskItem = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  statusId: string;
  dueDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};
