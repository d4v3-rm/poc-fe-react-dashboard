import { DeleteOutlined, EditOutlined, FlagOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Dropdown, Popconfirm, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDueDate, isOverdue } from '../../../shared/utils/date';
import type { TaskItem, TaskStatus } from '../task.types';
import './TaskCard.css';

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
    <article className={clsx('task-card', { 'task-card--compact': compact })}>
      <header className="task-card__header">
        <Typography.Title className="task-card__title" level={compact ? 5 : 4}>
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
      </header>

      <div className="task-card__tags">
        <Tag color={status.color}>{status.name}</Tag>
        <Tag color={dueIsOverdue ? 'error' : 'default'}>{formatDueDate(task.dueDate, language)}</Tag>
      </div>

      <div className="task-card__markdown markdown-surface">
        {task.content.trim() ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.content}</ReactMarkdown>
        ) : (
          <Typography.Text type="secondary">{t('task.form.markdownHint')}</Typography.Text>
        )}
      </div>

      <footer className="task-card__actions">
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
      </footer>
    </article>
  );
};
