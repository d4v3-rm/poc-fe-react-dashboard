import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Button,
  Card,
  Dropdown,
  Empty,
  Flex,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import type { TaskItem, TaskStatus } from "../../tasks/task.types";
import { statusTagStyle } from "../../../shared/theme/color-utils";
import { SortableTaskCard } from "./SortableTaskCard";

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: TaskItem[];
  statuses: TaskStatus[];
  canDeleteStatus: boolean;
  language: "en" | "it";
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
  onOpenTaskDetails: (taskId: string) => void;
  onEditStatus: (status: TaskStatus) => void;
  onDeleteStatus: (status: TaskStatus) => void;
};

const KANBAN_COLUMN_WIDTH = 332;

export const KanbanColumn = ({
  status,
  tasks,
  statuses,
  canDeleteStatus,
  language,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onOpenTaskDetails,
  onEditStatus,
  onDeleteStatus,
}: KanbanColumnProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { isOver, setNodeRef } = useDroppable({
    id: status.id,
  });

  const actions: MenuProps["items"] = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: t("actions.edit"),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      danger: true,
      disabled: !canDeleteStatus,
      label: t("actions.delete"),
    },
  ];

  return (
    <Card
      ref={setNodeRef}
      size="small"
      title={
        <Flex align="center" gap={8} justify="space-between">
          <Flex align="center" gap={8}>
            <Tag style={statusTagStyle(status.color)}>
              {status.name}
            </Tag>
            <Typography.Text type="secondary">{tasks.length}</Typography.Text>
          </Flex>

          <Dropdown
            menu={{
              items: actions,
              onClick: ({ key }) => {
                if (key === "edit") {
                  onEditStatus(status);
                  return;
                }

                if (canDeleteStatus) {
                  onDeleteStatus(status);
                }
              },
            }}
            trigger={["click"]}
          >
            <Tooltip title={t("actions.more")}>
              <Button
                aria-label={t("actions.more")}
                icon={<MoreOutlined />}
                size="small"
                type="text"
              />
            </Tooltip>
          </Dropdown>
        </Flex>
      }
      style={{
        borderColor: isOver ? token.colorPrimary : token.colorBorderSecondary,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: token.borderRadiusLG,
        width: KANBAN_COLUMN_WIDTH,
        minWidth: KANBAN_COLUMN_WIDTH,
        maxWidth: KANBAN_COLUMN_WIDTH,
        flex: `0 0 ${KANBAN_COLUMN_WIDTH}px`,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        maxHeight: "100%",
        height: "100%",
      }}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
        },
      }}
    >
      <Flex vertical gap={10} style={{ minHeight: 0, flex: 1 }}>
        <Typography.Text
          type="secondary"
          style={{ fontSize: token.fontSizeSM }}
        >
          {t("kanban.dragHint")}
        </Typography.Text>

        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <Flex
            gap={10}
            style={{
              minHeight: 0,
              paddingBottom: 12,
              paddingRight: 2,
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              WebkitOverflowScrolling: "touch",
              scrollbarGutter: "stable",
            }}
            vertical
          >
            {tasks.length === 0 && (
              <Empty
                description={t("kanban.emptyColumn")}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ margin: "18px 0" }}
              />
            )}
            {tasks.map((task) => (
              <SortableTaskCard
                key={task.id}
                language={language}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                onStatusChange={onStatusChange}
                onOpenTaskDetails={onOpenTaskDetails}
                status={status}
                statuses={statuses}
                task={task}
              />
            ))}
          </Flex>
        </SortableContext>
      </Flex>
    </Card>
  );
};
