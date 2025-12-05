import { DeleteOutlined, EditOutlined, FlagOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Flex, Popconfirm, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDueDate, isOverdue } from '../../../shared/utils/date';
import type { TaskItem, TaskStatus } from '../task.types';

type TaskCardProps = {
  task: TaskItem;
  status: TaskStatus;
  statuses: TaskStatus[];
  language: 'en' | 'it';
  compact?: boolean;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
};

export const TaskCard = ({
  task,
  status,
  statuses,
  language,
  compact = false,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) => {
  const { t } = useTranslation();
  const dueIsOverdue = isOverdue(task.dueDate);

  const statusOptions: MenuProps['items'] = statuses
    .filter((option) => option.id !== task.statusId)
    .map((option) => ({
      key: option.id,
      label: option.name,
      icon: <FlagOutlined style={{ color: option.color }} />,
    }));

  return (
    <Card
      size="small"
      style={{
        minHeight: compact ? 180 : 220,
      }}
    >
      <Flex gap={10} vertical>
        <Flex align="start" justify="space-between">
          <Typography.Title level={compact ? 5 : 4} style={{ lineHeight: 1.3, margin: 0 }}>
            {task.title}
          </Typography.Title>

        {statusOptions.length > 0 && (
          <Dropdown
            menu={{
              items: statusOptions,
              onClick: ({ key }) => onStatusChange(task.id, String(key)),
            }}
            trigger={['click']}
          >
            <Button icon={<SwapOutlined />} size="small" type="text" />
          </Dropdown>
        )}
        </Flex>

        <Space size={6} wrap>
          <Tag color={status.color}>{status.name}</Tag>
          <Tag color={dueIsOverdue ? 'error' : 'default'}>{formatDueDate(task.dueDate, language)}</Tag>
        </Space>

        <Card size="small" style={{ maxHeight: 130, minHeight: 94, overflow: 'auto' }}>
          {task.content.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.content}</ReactMarkdown>
          ) : (
            <Typography.Text type="secondary">{t('task.form.markdownHint')}</Typography.Text>
          )}
        </Card>

        <Space size={6}>
          <Button icon={<EditOutlined />} onClick={() => onEdit(task.id)} size="small">
            {t('actions.edit')}
          </Button>

          <Popconfirm
            description={t('task.deleteConfirm.description')}
            okText={t('actions.delete')}
            okType="danger"
            onConfirm={() => onDelete(task.id)}
            title={t('task.deleteConfirm.title')}
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              {t('actions.delete')}
            </Button>
          </Popconfirm>
        </Space>
      </Flex>
    </Card>
  );
};
