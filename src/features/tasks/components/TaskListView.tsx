import { Card, Empty, Flex, Tag, Typography } from "antd";
import { useTranslation } from "react-i18next";
import type { TaskItem, TaskStatus } from "../task.types";
import { semanticTagStyle } from "../../../shared/theme/color-utils";
import { TaskCard } from "./TaskCard";

type TaskListViewProps = {
  tasks: TaskItem[];
  statuses: TaskStatus[];
  language: "en" | "it";
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStatusChange: (taskId: string, statusId: string) => void;
  onOpenTaskDetails: (taskId: string) => void;
};

export const TaskListView = ({
  tasks,
  statuses,
  language,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onOpenTaskDetails,
}: TaskListViewProps) => {
  const { t } = useTranslation();
  const groupedTasks = statuses
    .map((status) => ({
      status,
      tasks: tasks
        .filter((task) => task.statusId === status.id)
        .sort((first, second) => first.order - second.order),
    }))
    .filter((group) => group.tasks.length > 0);

  if (tasks.length === 0) {
    return (
      <Card>
        <Empty description={t("task.empty")} />
      </Card>
    );
  }

  return (
    <Flex
      gap={16}
      style={{
        width: "100%",
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        overflowX: "hidden",
        paddingRight: 2,
        paddingBottom: 10,
      }}
      vertical
    >
      {groupedTasks.map(({ status, tasks: statusTasks }) => (
        <Card
          key={status.id}
          size="small"
          title={
            <Flex align="center" gap={10} justify="space-between">
              <Flex align="center" gap={8}>
                <Tag style={semanticTagStyle(status.color, 0.16, 0.35)}>
                  {status.name}
                </Tag>
                <Typography.Text type="secondary">
                  {statusTasks.length}
                </Typography.Text>
              </Flex>
            </Flex>
          }
        >
          <Flex gap={12} wrap>
            {statusTasks.map((task) => (
              <div key={task.id} style={{ flex: "1 1 320px", minWidth: 280 }}>
                <TaskCard
                  language={language}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  onStatusChange={onStatusChange}
                  onOpenDetails={onOpenTaskDetails}
                  status={status}
                  statuses={statuses}
                  task={task}
                />
              </div>
            ))}
          </Flex>
        </Card>
      ))}

      {groupedTasks.length === 0 && <Empty description={t("task.empty")} />}
    </Flex>
  );
};
