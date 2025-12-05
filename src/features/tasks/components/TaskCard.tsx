import { Card, Flex, Tag, Typography, theme } from "antd";
import { useState } from "react";
import { semanticTagStyle, toRgba } from "../../../shared/theme/color-utils";
import { TaskCardFooter } from "./TaskCardFooter";
import { TaskCardHeader } from "./TaskCardHeader";
import type { TaskCardProps } from "./TaskCard.types";

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
  const { token } = theme.useToken();
  const [isHovering, setIsHovering] = useState(false);
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
          <TaskCardHeader
            dragHandleProps={dragHandleProps}
            onStatusChange={onStatusChange}
            showDragHandle={showDragHandle}
            status={status}
            statuses={statuses}
            task={task}
          />
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
          <TaskCardFooter
            language={language}
            onDelete={onDelete}
            onEdit={onEdit}
            showActions={showActions}
            task={task}
          />
        </Flex>
      </Flex>
    </Card>
  );
};
