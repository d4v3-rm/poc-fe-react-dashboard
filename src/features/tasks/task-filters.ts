import type { TaskItem } from '../tasks/task.types';
import type { TaskFilters } from '../../store/dashboard-store.types';
import { isOverdue, isToday, isWithinNextWeek } from '../../shared/utils/date';

const matchesDueFilter = (task: TaskItem, dueFilter: TaskFilters['due']): boolean => {
  if (dueFilter === 'all') {
    return true;
  }

  if (dueFilter === 'no_due') {
    return task.dueDate === null;
  }

  if (dueFilter === 'overdue') {
    return isOverdue(task.dueDate);
  }

  if (dueFilter === 'today') {
    return isToday(task.dueDate);
  }

  return isWithinNextWeek(task.dueDate);
};

export const filterTasks = (tasks: TaskItem[], filters: TaskFilters): TaskItem[] => {
  const query = filters.query.trim().toLowerCase();

  return tasks.filter((task) => {
    const matchesQuery =
      query.length === 0 ||
      task.title.toLowerCase().includes(query) ||
      task.content.toLowerCase().includes(query);

    const matchesStatus =
      filters.statusIds.length === 0 || filters.statusIds.includes(task.statusId);

    const matchesDue = matchesDueFilter(task, filters.due);

    return matchesQuery && matchesStatus && matchesDue;
  });
};
