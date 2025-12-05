import { closestCorners, DndContext, DragOverlay } from "@dnd-kit/core";
import { Flex } from "antd";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "../../tasks/components/TaskCard";
import { useKanbanBoardDrag } from "../hooks/useKanbanBoardDrag";
import type { KanbanBoardProps } from "./KanbanBoard.types";

export const KanbanBoard = ({
  statuses,
  tasks,
  language,
  onMoveTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onOpenTaskDetails,
  onEditStatus,
  onDeleteStatus,
}: KanbanBoardProps) => {
  const {
    activeTask,
    activeStatus,
    groupedTasks,
    sensors,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
  } = useKanbanBoardDrag({
    statuses,
    tasks,
    onMoveTask,
  });

  return (
    <Flex
      gap={12}
      style={{ height: "100%", minHeight: 0, overflow: "hidden" }}
      vertical
    >
      <DndContext
        collisionDetection={closestCorners}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <Flex
          gap={12}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "hidden",
            overflowX: "auto",
            paddingBottom: 14,
            boxSizing: "border-box",
            scrollbarGutter: "stable both-edges",
          }}
          wrap={false}
          align="stretch"
        >
          {statuses.map((status) => (
            <KanbanColumn
              canDeleteStatus={statuses.length > 1}
              key={status.id}
              language={language}
              onDeleteStatus={onDeleteStatus}
              onDeleteTask={onDeleteTask}
              onEditStatus={onEditStatus}
              onEditTask={onEditTask}
              onStatusChange={onStatusChange}
              onOpenTaskDetails={onOpenTaskDetails}
              status={status}
              statuses={statuses}
              tasks={groupedTasks[status.id] ?? []}
            />
          ))}
        </Flex>

        <DragOverlay>
          {activeTask && activeStatus ? (
            <TaskCard
              compact
              isOverlay
              language={language}
              onDelete={() => {
                return;
              }}
              onEdit={() => {
                return;
              }}
              onStatusChange={() => {
                return;
              }}
              onOpenDetails={() => {
                return;
              }}
              status={activeStatus}
              statuses={statuses}
              task={activeTask}
              showActions={false}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </Flex>
  );
};
