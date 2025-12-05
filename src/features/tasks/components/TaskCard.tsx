import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
  FlagOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { MenuProps } from "antd";
import { useState } from "react";
import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import {
  semanticTagStyle,
  statusTagStyle,
  toRgba,
} from "../../../shared/theme/color-utils";
import { formatDueDate, isOverdue } from "../../../shared/utils/date";
import type { TaskItem, TaskStatus } from "../task.types";

type TaskCardProps = {
  task: TaskItem;
  status: TaskStatus;
  statuses: TaskStatus[];
  language: "en" | "it";
  compact?: boolean;
  isOverlay?: boolean;
  showActions?: boolean;
  showDragHandle?: boolean;
  onOpenDetails: (taskId: string) => void;
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
  onOpenDetails,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [isHovering, setIsHovering] = useState(false);
  const dueIsOverdue = isOverdue(task.dueDate);
  const dueTagColor = dueIsOverdue ? token.colorError : token.colorInfo;
  const dueTagStyle = semanticTagStyle(
    dueTagColor,
    0.18,
    0.42,
    token.colorBgContainer,
  );
  const taskTagStyle = semanticTagStyle(
    token.colorPrimary,
    0.14,
    0.34,
    token.colorBgContainer,
  );
  const hoverBorder = isHovering
    ? toRgba(token.colorPrimary, 0.34)
    : token.colorBorder;
  const hoverBg = isHovering
    ? toRgba(token.colorPrimary, 0.08)
    : token.colorBgContainer;
  const statusOptions: MenuProps["items"] = statuses
    .filter((option) => option.id !== task.statusId)
    .map((option) => ({
      key: option.id,
      label: option.name,
      icon: <FlagOutlined style={{ color: option.color }} />,
    }));
  const visibleTags = task.tags.slice(0, 4);
  const hasExtraTags = task.tags.length > 4;

  return (
    <Card
      size="small"
      role="button"
      onClick={() => {
        if (!isOverlay) {
          onOpenDetails(task.id);
        }
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      hoverable={!isOverlay}
      style={{
        backgroundColor: isOverlay ? token.colorBgElevated : hoverBg,
        borderColor: isOverlay ? "transparent" : hoverBorder,
        borderRadius: token.borderRadiusLG,
        boxShadow: isOverlay
          ? token.boxShadowSecondary
          : isHovering
            ? `0 10px 18px -10px ${toRgba(token.colorPrimary, 0.35)}`
            : token.boxShadow,
        minHeight: compact ? 156 : 172,
        overflow: "hidden",
        transition: "all .2s ease",
        width: "100%",
        cursor: "pointer",
      }}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <Flex gap={10} style={{ minHeight: 0, height: "100%" }} vertical>
        <Flex align="center" gap={8} justify="space-between">
          <Tag style={statusTagStyle(status.color, token.colorBgContainer)}>
            {status.name}
          </Tag>

          <Space size={4} align="center">
            {showDragHandle && dragHandleProps ? (
              <Tooltip title={t("task.drag")}>
                <Button
                  aria-label={t("task.drag")}
                  icon={<HolderOutlined />}
                  ref={(element) =>
                    dragHandleProps.setActivatorNodeRef?.(element)
                  }
                  size="small"
                  type="text"
                  {...dragHandleProps.attributes}
                  {...dragHandleProps.listeners}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={(event) => event.stopPropagation()}
                />
              </Tooltip>
            ) : null}

            {statusOptions.length > 0 && (
              <Dropdown
                menu={{
                  items: statusOptions,
                  onClick: ({ key }) => {
                    onStatusChange(task.id, String(key));
                  },
                }}
                trigger={["click"]}
              >
                <Tooltip title={t("task.quickStatus")}>
                  <Button
                    aria-label={t("task.quickStatus")}
                    icon={<SwapOutlined />}
                    size="small"
                    type="text"
                    onClick={(event) => event.stopPropagation()}
                  />
                </Tooltip>
              </Dropdown>
            )}
          </Space>
        </Flex>

        <Flex align="start" style={{ minHeight: 0, flex: 1 }}>
          <Typography.Paragraph
            title={task.title}
            style={{
              color: token.colorText,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              lineHeight: 1.35,
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 0,
              overflow: "hidden",
            }}
          >
            {task.title}
          </Typography.Paragraph>
        </Flex>

        {task.tags.length > 0 ? (
          <Flex gap={6} wrap>
            {visibleTags.map((tag) => (
              <Tag key={tag} style={taskTagStyle}>
                {tag}
              </Tag>
            ))}
            {hasExtraTags ? (
              <Tag
                style={taskTagStyle}
              >{`+${task.tags.length - visibleTags.length}`}</Tag>
            ) : null}
          </Flex>
        ) : null}

        <Flex align="center" gap={8} justify="space-between" wrap>
          <Tag
            icon={dueIsOverdue ? <FlagOutlined /> : undefined}
            style={dueTagStyle}
          >
            {formatDueDate(task.dueDate, language)}
          </Tag>

          {showActions && (
            <Space size={6}>
              <Tooltip title={t("actions.edit")}>
                <Button
                  aria-label={t("actions.edit")}
                  icon={<EditOutlined />}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(task.id);
                  }}
                  size="small"
                />
              </Tooltip>

              <Popconfirm
                description={t("task.deleteConfirm.description")}
                cancelButtonProps={{
                  "aria-label": t("actions.cancel"),
                  icon: <CloseOutlined />,
                }}
                okButtonProps={{
                  "aria-label": t("actions.delete"),
                  icon: <DeleteOutlined />,
                }}
                okText={t("actions.delete")}
                okType="danger"
                onConfirm={() => onDelete(task.id)}
                title={t("task.deleteConfirm.title")}
                cancelText={t("actions.cancel")}
              >
                <Tooltip title={t("actions.delete")}>
                  <Button
                    aria-label={t("actions.delete")}
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={(event) => event.stopPropagation()}
                  />
                </Tooltip>
              </Popconfirm>
            </Space>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
