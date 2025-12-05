import { Card, Col, Empty, Row, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { TaskItem, TaskStatus } from '../task.types';
import { TaskCard } from './TaskCard';

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
    return (
      <Card>
        <Empty description={t('task.empty')} />
      </Card>
    );
  }

  return (
    <Space direction="vertical" size={20} style={{ width: '100%' }}>
      {statuses.map((status) => {
        const statusTasks = tasks
          .filter((task) => task.statusId === status.id)
          .sort((first, second) => first.order - second.order);

        if (statusTasks.length === 0) {
          return null;
        }

        return (
          <Card key={status.id}>
            <Typography.Title level={5} style={{ marginTop: 0 }}>
              {status.name}
            </Typography.Title>
            <Row gutter={[12, 12]}>
              {statusTasks.map((task) => (
                <Col key={task.id} lg={8} md={12} sm={24} xl={6} xs={24}>
                  <TaskCard
                    language={language}
                    onDelete={onDeleteTask}
                    onEdit={onEditTask}
                    onStatusChange={onStatusChange}
                    status={status}
                    statuses={statuses}
                    task={task}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        );
      })}
    </Space>
  );
};
