import { Flex } from "antd";
import { KanbanBoard } from "../../../features/kanban/components/KanbanBoard";
import { TaskListView } from "../../../features/tasks/components/TaskListView";
import { DashboardWorkspaceHeader } from "./DashboardWorkspaceHeader";
import type { DashboardWorkspaceContentProps } from "./DashboardWorkspace.types";

export const DashboardWorkspaceContent = ({
  viewMode,
  language,
  tasks,
  statuses,
  onDeleteTask,
  onEditTask,
  onStatusChange,
  onOpenTaskDetails,
  onMoveTask,
  onEditStatus,
  onDeleteStatus,
  projectName,
  projectDescription,
}: DashboardWorkspaceContentProps & {
  projectName: string;
  projectDescription: string;
}) => (
  <Flex
    gap={12}
    style={{
      flex: 1,
      minHeight: 0,
      flexDirection: "column",
      overflow: "hidden",
    }}
    vertical
  >
    <DashboardWorkspaceHeader
      projectDescription={projectDescription}
      projectName={projectName}
    />

    <Flex style={{ flex: 1, minHeight: 0, overflow: "hidden" }} vertical>
      {viewMode === "list" ? (
        <TaskListView
          language={language}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onOpenTaskDetails={onOpenTaskDetails}
          onStatusChange={onStatusChange}
          statuses={statuses}
          tasks={tasks}
        />
      ) : (
        <KanbanBoard
          language={language}
          onDeleteStatus={onDeleteStatus}
          onDeleteTask={onDeleteTask}
          onEditStatus={onEditStatus}
          onEditTask={onEditTask}
          onMoveTask={onMoveTask}
          onOpenTaskDetails={onOpenTaskDetails}
          onStatusChange={onStatusChange}
          statuses={statuses}
          tasks={tasks}
        />
      )}
    </Flex>
  </Flex>
);
