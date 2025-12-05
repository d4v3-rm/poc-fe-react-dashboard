import { Empty, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { TaskItem, TaskStatus } from '../task.types';
import { TaskCard } from './TaskCard';
import './TaskListView.css';

type TaskListViewProps = {
  tasks: TaskItem[];
  statuses: TaskStatus[];
  language: 'en' | 'it';
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
};

export const TaskListView = ({
  tasks,
  statuses,
  language,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}: TaskListViewProps) => {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return <Empty className="task-list-view__empty" description={t('task.empty')} />;
  }

  return (
    <div className="task-list-view">
      {statuses.map((status) => {
        const statusTasks = tasks
          .filter((task) => task.statusId === status.id)
          .sort((first, second) => first.order - second.order);

        if (statusTasks.length === 0) {
          return null;
        }

        return (
          <section className="task-list-view__section" key={status.id}>
            <Typography.Title className="task-list-view__section-title" level={5}>
              {status.name}
            </Typography.Title>
            <div className="task-list-view__grid">
              {statusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  language={language}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onStatusChange={onStatusChange}
                  status={status}
                  statuses={statuses}
                  task={task}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
