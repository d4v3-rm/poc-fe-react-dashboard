import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button, Card, Dropdown, Empty, Flex, Space, Tag, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
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
  const { token } = theme.useToken();
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
    <Card
      ref={setNodeRef}
      size="small"
      style={{
        borderColor: isOver ? token.colorPrimary : token.colorBorderSecondary,
        borderWidth: isOver ? 2 : 1,
        borderStyle: 'solid',
        flex: '0 0 320px',
        minHeight: 540,
      }}
      title={
        <Flex align="center" justify="space-between">
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
        </Flex>
      }
    >
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <Flex gap={10} style={{ minHeight: 420 }} vertical>
          {tasks.length === 0 && <Empty description={t('kanban.emptyColumn')} image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '36px 0' }} />}
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
        </Flex>
      </SortableContext>
    </Card>
  );
};
