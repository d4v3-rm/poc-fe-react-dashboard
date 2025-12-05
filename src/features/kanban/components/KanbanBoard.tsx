import {
  closestCorners,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Flex } from "antd";
import { useMemo, useState } from "react";
import type { TaskItem, TaskStatus } from "../../tasks/task.types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "../../tasks/components/TaskCard";

type KanbanBoardProps = {
  statuses: TaskStatus[];
  tasks: TaskItem[];
  language: "en" | "it";
  onMoveTask: (
    taskId: string,
    targetStatusId: string,
    targetIndex?: number,
  ) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
  onOpenTaskDetails: (taskId: string) => void;
  onEditStatus: (status: TaskStatus) => void;
  onDeleteStatus: (status: TaskStatus) => void;
};

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
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const groupedTasks = useMemo(() => {
    const grouped: Record<string, TaskItem[]> = {};

    statuses.forEach((status) => {
      grouped[status.id] = tasks
        .filter((task) => task.statusId === status.id)
        .sort((first, second) => first.order - second.order);
    });

    return grouped;
  }, [statuses, tasks]);

  const taskById = useMemo(() => {
    const map = new Map<string, TaskItem>();
    tasks.forEach((task) => map.set(task.id, task));
    return map;
  }, [tasks]);

  const activeTask = activeTaskId ? taskById.get(activeTaskId) : null;
  const activeStatus = activeTask
    ? statuses.find((status) => status.id === activeTask.statusId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(String(event.active.id));
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    const activeTaskLocal = taskById.get(activeId);

    if (!activeTaskLocal) {
      return;
    }

    const overTask = taskById.get(overId);

    if (overTask) {
      const targetStatusId = overTask.statusId;
      const targetIndex = groupedTasks[targetStatusId]?.findIndex(
        (task) => task.id === overId,
      );

      onMoveTask(
        activeTaskLocal.id,
        targetStatusId,
        targetIndex === -1 ? undefined : targetIndex,
      );
      return;
    }

    const statusTarget = statuses.find((status) => status.id === overId);

    if (!statusTarget) {
      return;
    }

    const targetIndex = groupedTasks[statusTarget.id]?.length ?? 0;
    onMoveTask(activeTaskLocal.id, statusTarget.id, targetIndex);
  };

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
