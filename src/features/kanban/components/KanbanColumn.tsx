import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Card, Empty, Flex, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import { SortableTaskCard } from "./SortableTaskCard";
import { KanbanColumnHeader } from "./KanbanColumnHeader";
import type { KanbanColumnProps } from "./KanbanColumn.types";

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

  return (
    <Card
      ref={setNodeRef}
      size="small"
      title={
        <KanbanColumnHeader
          canDeleteStatus={canDeleteStatus}
          onDeleteStatus={onDeleteStatus}
          onEditStatus={onEditStatus}
          status={status}
          taskCount={tasks.length}
        />
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
          {t("task.dragHint")}
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
