import {
  PointerSensor,
  type DragEndEvent,
  type DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import type {
  UseKanbanBoardDragParams,
  UseKanbanBoardDragReturn,
} from "./useKanbanBoardDrag.types";

export const useKanbanBoardDrag = ({
  statuses,
  tasks,
  onMoveTask,
}: UseKanbanBoardDragParams): UseKanbanBoardDragReturn => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const groupedTasks = useMemo(() => {
    const grouped: Record<string, typeof tasks> = {};

    statuses.forEach((status) => {
      grouped[status.id] = tasks
        .filter((task) => task.statusId === status.id)
        .sort((first, second) => first.order - second.order);
    });

    return grouped;
  }, [statuses, tasks]);

  const taskById = useMemo(() => {
    const map = new Map<string, (typeof tasks)[number]>();
    tasks.forEach((task) => map.set(task.id, task));
    return map;
  }, [tasks]);

  const activeTask = activeTaskId ? (taskById.get(activeTaskId) ?? null) : null;
  const activeStatus = activeTask
    ? (statuses.find((status) => status.id === activeTask.statusId) ?? null)
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

  return {
    activeTask,
    activeStatus,
    groupedTasks,
    sensors,
    handleDragStart,
    handleDragCancel,
    handleDragEnd,
  };
};
