export type ViewMode = 'list' | 'kanban';

export type DueFilter = 'all' | 'overdue' | 'today' | 'week' | 'no_due';

export type LanguageCode = 'en' | 'it';

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
  statusId: string;
  dueDate: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
};
