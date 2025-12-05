import { CloseOutlined, DeleteOutlined, EditOutlined, FlagOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Flex, Popconfirm, Space, Tag, Tooltip, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { semanticTagStyle } from '../../../shared/theme/color-utils';
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
  const { token } = theme.useToken();
  const dueIsOverdue = isOverdue(task.dueDate);
  const dueTagColor = dueIsOverdue ? token.colorError : token.colorInfo;
  const dueTagStyle = semanticTagStyle(dueTagColor, 0.18, 0.42);

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
              <Tooltip title={t('task.quickStatus')}>
                <Button aria-label={t('task.quickStatus')} icon={<SwapOutlined />} size="small" type="text" />
              </Tooltip>
            </Dropdown>
          )}
        </Flex>

        <Space size={6} wrap>
          <Tag style={semanticTagStyle(status.color, 0.14, 0.35)}>{status.name}</Tag>
          <Tag style={dueTagStyle}>{formatDueDate(task.dueDate, language)}</Tag>
        </Space>

        <Card size="small" style={{ maxHeight: 130, minHeight: 94, overflow: 'auto' }}>
          {task.content.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.content}</ReactMarkdown>
          ) : (
            <Typography.Text type="secondary">{t('task.form.markdownHint')}</Typography.Text>
          )}
        </Card>

        <Space size={6}>
          <Tooltip title={t('actions.edit')}>
            <Button aria-label={t('actions.edit')} icon={<EditOutlined />} onClick={() => onEdit(task.id)} size="small" />
          </Tooltip>

          <Popconfirm
            description={t('task.deleteConfirm.description')}
            cancelButtonProps={{
              'aria-label': t('actions.cancel'),
              icon: <CloseOutlined />,
            }}
            cancelText=""
            okButtonProps={{
              'aria-label': t('actions.delete'),
              icon: <DeleteOutlined />,
            }}
            okText=""
            okType="danger"
            onConfirm={() => onDelete(task.id)}
            title={t('task.deleteConfirm.title')}
          >
            <Tooltip title={t('actions.delete')}>
              <Button aria-label={t('actions.delete')} danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      </Flex>
    </Card>
  );
};
