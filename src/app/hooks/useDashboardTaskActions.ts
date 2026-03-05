import type {
  TaskFormValues,
  UseDashboardTaskActionsParams,
} from "./useDashboardTaskActions.types";

export const useDashboardTaskActions = ({
  activeProject,
  taskEditorMode,
  editingTaskId,
  createTask,
  updateTask,
  removeTask,
  moveTask,
  closeTaskEditor,
}: UseDashboardTaskActionsParams) => {
  const handleTaskSubmit = (values: TaskFormValues) => {
    if (!activeProject) {
      return;
    }

    const fallbackStatusId = activeProject.statuses[0]?.id ?? "";
    const safeStatusId = values.statusId || fallbackStatusId;

    if (taskEditorMode === "create") {
      createTask(activeProject.id, {
        title: values.title,
        content: values.content,
        tags: values.tags,
        dueDate: values.dueDate,
        statusId: safeStatusId,
      });
    } else if (editingTaskId) {
      updateTask(activeProject.id, editingTaskId, {
        title: values.title,
        content: values.content,
        tags: values.tags,
        dueDate: values.dueDate,
        statusId: safeStatusId,
      });
    }

    closeTaskEditor();
  };

  const handleTaskDelete = (taskId: string) => {
    if (!activeProject) {
      return;
    }

    removeTask(activeProject.id, taskId);
  };

  const handleTaskStatusChange = (taskId: string, statusId: string) => {
    if (!activeProject) {
      return;
    }

    moveTask(activeProject.id, taskId, statusId);
  };

  const handleMoveTask = (
    taskId: string,
    targetStatusId: string,
    targetIndex?: number,
  ) => {
    if (!activeProject) {
      return;
    }

    moveTask(activeProject.id, taskId, targetStatusId, targetIndex);
  };

  return {
    handleTaskSubmit,
    handleTaskDelete,
    handleTaskStatusChange,
    handleMoveTask,
  };
};
