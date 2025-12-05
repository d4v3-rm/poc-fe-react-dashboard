import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, Dropdown, Empty, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { TaskItem, TaskStatus } from '../../tasks/task.types';
import { SortableTaskCard } from './SortableTaskCard';

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: TaskItem[];
  statuses: TaskStatus[];
  canDeleteStatus: boolean;
  language: 'en' | 'it';
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
  onEditStatus: (status: TaskStatus) => void;
  onDeleteStatus: (status: TaskStatus) => void;
};

export const KanbanColumn = ({
  status,
  tasks,
  statuses,
  canDeleteStatus,
  language,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onEditStatus,
  onDeleteStatus,
}: KanbanColumnProps) => {
  const { t } = useTranslation();
  const { isOver, setNodeRef } = useDroppable({
    id: status.id,
  });

  const actions: MenuProps['items'] = [
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: t('actions.edit'),
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      danger: true,
      disabled: !canDeleteStatus,
      label: t('actions.delete'),
    },
  ];

  return (
    <section className={clsx('kanban-column', { 'kanban-column--over': isOver })} ref={setNodeRef}>
      <header className="kanban-column__header">
        <Space align="center" size={8}>
          <Tag color={status.color}>{status.name}</Tag>
          <Typography.Text type="secondary">{tasks.length}</Typography.Text>
        </Space>

        <Dropdown
          menu={{
            items: actions,
            onClick: ({ key }) => {
              if (key === 'edit') {
                onEditStatus(status);
                return;
              }

              if (canDeleteStatus) {
                onDeleteStatus(status);
              }
            },
          }}
          trigger={['click']}
        >
          <Button icon={<MoreOutlined />} size="small" type="text" />
        </Dropdown>
      </header>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="kanban-column__tasks">
          {tasks.length === 0 && (
            <Empty
              className="kanban-column__empty"
              description={t('kanban.emptyColumn')}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}

          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              language={language}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              onStatusChange={onStatusChange}
              status={status}
              statuses={statuses}
              task={task}
            />
          ))}
        </div>
      </SortableContext>
    </section>
  );
};
