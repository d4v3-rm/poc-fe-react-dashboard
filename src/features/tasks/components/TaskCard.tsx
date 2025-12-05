import { CloseOutlined, DeleteOutlined, EditOutlined, HolderOutlined, WarningOutlined, FlagOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Flex, Popconfirm, Space, Tag, Tooltip, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
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
  isOverlay?: boolean;
  showActions?: boolean;
  showDragHandle?: boolean;
  dragHandleProps?: {
    attributes?: DraggableAttributes;
    listeners?: DraggableSyntheticListeners;
    setActivatorNodeRef?: (element: HTMLElement | null) => void;
  };
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
  isOverlay = false,
  showActions = true,
  showDragHandle = false,
  dragHandleProps,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const dueIsOverdue = isOverdue(task.dueDate);
  const dueTagColor = dueIsOverdue ? token.colorError : token.colorInfo;
  const dueTagStyle = semanticTagStyle(dueTagColor, 0.18, 0.42);
  const contentHeight = compact ? 88 : 108;

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
      hoverable={!isOverlay}
      style={{
        borderColor: isOverlay ? 'transparent' : undefined,
        borderRadius: token.borderRadiusLG,
        boxShadow: isOverlay ? token.boxShadowSecondary : token.boxShadow,
        maxWidth: isOverlay ? 420 : undefined,
        opacity: isOverlay ? 0.95 : 1,
        minHeight: compact ? 180 : 220,
      }}
    >
      <Flex gap={10} vertical>
        <Flex align="center" gap={8} justify="space-between">
          <Tag style={semanticTagStyle(status.color, 0.14, 0.38)}>{status.name}</Tag>

          <Space size={4} align="center">
            {showDragHandle && dragHandleProps ? (
              <Tooltip title={t('task.drag')}>
                <Button
                  aria-label={t('task.drag')}
                  icon={<HolderOutlined />}
                  ref={(element) => dragHandleProps.setActivatorNodeRef?.(element)}
                  size="small"
                  type="text"
                  {...dragHandleProps.attributes}
                  {...dragHandleProps.listeners}
                />
              </Tooltip>
            ) : null}

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
          </Space>
        </Flex>

        <Flex align="start" justify="space-between">
          <Typography.Title level={compact ? 5 : 4} style={{ lineHeight: 1.3, margin: 0 }}>
            {task.title}
          </Typography.Title>
        </Flex>

        <Space size={6} wrap>
          <Tag icon={dueIsOverdue ? <WarningOutlined /> : undefined} style={dueTagStyle}>
            {formatDueDate(task.dueDate, language)}
          </Tag>
        </Space>

        <div
          style={{
            backgroundColor: token.colorFillTertiary,
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadius,
            flex: 1,
            minHeight: compact ? 84 : 110,
            maxHeight: contentHeight,
            overflow: 'hidden',
            padding: 12,
            }}
          >
            <Typography.Text
              strong
              style={{
                color: token.colorTextSecondary,
              display: compact ? 'none' : 'block',
              marginBottom: compact ? 0 : 8,
            }}
          >
            {t('task.preview')}
          </Typography.Text>
          {task.content.trim() ? (
              <div style={{ overflow: 'hidden', whiteSpace: compact ? 'nowrap' : 'normal' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{task.content}</ReactMarkdown>
              </div>
            ) : (
              <Typography.Text type="secondary">{t('task.form.markdownHint')}</Typography.Text>
          )}
        </div>

        {showActions && (
          <Space size={6}>
            <Tooltip title={t('actions.edit')}>
              <Button
                aria-label={t('actions.edit')}
                icon={<EditOutlined />}
                onClick={() => onEdit(task.id)}
                size="small"
              />
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
        )}
      </Flex>
    </Card>
  );
};
