import { PlusOutlined } from '@ant-design/icons';
import { closestCorners, DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { Button, Flex, Tooltip } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TaskItem, TaskStatus } from '../../tasks/task.types';
import { KanbanColumn } from './KanbanColumn';

type KanbanBoardProps = {
  statuses: TaskStatus[];
  tasks: TaskItem[];
  language: 'en' | 'it';
  onMoveTask: (taskId: string, targetStatusId: string, targetIndex?: number) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
  onAddStatus: () => void;
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
  onAddStatus,
  onEditStatus,
  onDeleteStatus,
}: KanbanBoardProps) => {
  const { t } = useTranslation();

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    const activeTask = taskById.get(activeId);

    if (!activeTask) {
      return;
    }

    const overTask = taskById.get(overId);

    if (overTask) {
      const targetStatusId = overTask.statusId;
      const targetIndex = groupedTasks[targetStatusId]?.findIndex((task) => task.id === overId);

      onMoveTask(activeTask.id, targetStatusId, targetIndex === -1 ? undefined : targetIndex);
      return;
    }

    const statusTarget = statuses.find((status) => status.id === overId);

    if (!statusTarget) {
      return;
    }

    const targetIndex = groupedTasks[statusTarget.id]?.length ?? 0;
    onMoveTask(activeTask.id, statusTarget.id, targetIndex);
  };

  return (
    <Flex gap={12} vertical>
      <Flex justify="end">
        <Tooltip title={t('kanban.addStatus')}>
          <Button aria-label={t('kanban.addStatus')} icon={<PlusOutlined />} onClick={onAddStatus} type="dashed" />
        </Tooltip>
      </Flex>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd} sensors={sensors}>
        <Flex gap={12} style={{ overflowX: 'auto', paddingBottom: 8 }}>
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
              status={status}
              statuses={statuses}
              tasks={groupedTasks[status.id] ?? []}
            />
          ))}
        </Flex>
      </DndContext>
    </Flex>
  );
};
