import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Flex,
  Grid,
  Space,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { OVERLAY_MASK_STYLE } from "../../../shared/ui/overlay.styles";
import {
  createTaskFormSchema,
  type TaskFormValues,
} from "../task-editor.schema";
import { TaskEditorForm } from "./TaskEditorForm";
import { TaskEditorPreview } from "./TaskEditorPreview";
import type { TaskEditorDrawerProps } from "./TaskEditorDrawer.types";
import {
  getTaskEditorDefaultValues,
  getTaskEditorInitialValues,
  normalizeTaskEditorTags,
  serializeTaskEditorValues,
} from "./TaskEditorDrawer.utils";

export const TaskEditorDrawer = ({
  open,
  mode,
  statuses,
  availableTags = [],
  initialTask,
  onClose,
  onSubmit,
}: TaskEditorDrawerProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const schema = useMemo(() => createTaskFormSchema(t), [t]);
  const screens = Grid.useBreakpoint();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: getTaskEditorDefaultValues(statuses),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset(getTaskEditorInitialValues(initialTask, statuses));
  }, [initialTask, open, reset, statuses]);

  const content = useWatch({
    control,
    name: "content",
  });
  const dueDate = useWatch({
    control,
    name: "dueDate",
  });
  const statusId = useWatch({
    control,
    name: "statusId",
  });
  const selectedTags = useWatch({
    control,
    name: "tags",
  });

  const previewStatus =
    statuses.find((entry) => entry.id === statusId) ?? statuses[0];
  const previewTags = normalizeTaskEditorTags(selectedTags);
  const previewDueDate = dueDate ? dueDate.format("YYYY-MM-DD") : "";

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex justify="end">
          <Space>
            <Tooltip title={t("actions.cancel")}>
              <Button
                aria-label={t("actions.cancel")}
                icon={<CloseOutlined />}
                onClick={onClose}
              >
                {t("actions.cancel")}
              </Button>
            </Tooltip>
            <Tooltip
              title={
                mode === "create" ? t("actions.create") : t("actions.save")
              }
            >
              <Button
                aria-label={
                  mode === "create" ? t("actions.create") : t("actions.save")
                }
                icon={mode === "create" ? <PlusOutlined /> : <CheckOutlined />}
                loading={isSubmitting}
                onClick={handleSubmit((values) =>
                  onSubmit(serializeTaskEditorValues(values)),
                )}
                type="primary"
              >
                {mode === "create" ? t("actions.create") : t("actions.save")}
              </Button>
            </Tooltip>
          </Space>
        </Flex>
      }
      onClose={onClose}
      open={open}
      placement="right"
      size="large"
      title={mode === "create" ? t("task.create") : t("task.edit")}
      width="min(860px, 95vw)"
      styles={{
        root: {
          margin: "12px 12px 12px 0",
        },
        mask: OVERLAY_MASK_STYLE,
        section: {
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          background: token.colorBgContainer,
          boxShadow: token.boxShadowSecondary,
          overflow: "hidden",
        },
        body: {
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          padding: 0,
          overflow: "hidden",
        },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
          padding: "12px 16px",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Flex align="center" gap={8} justify="space-between" wrap>
            <Typography.Text type="secondary">
              {t("task.preview")}
            </Typography.Text>
            <Typography.Text type="secondary">
              {mode === "create" ? t("actions.create") : t("actions.edit")}
            </Typography.Text>
          </Flex>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: 12,
            display: screens.lg ? "flex" : "block",
            gap: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              marginBottom: screens.lg ? 0 : 12,
            }}
          >
            <TaskEditorForm
              availableTags={availableTags}
              control={control}
              errors={errors}
              isWideLayout={Boolean(screens.sm)}
              statuses={statuses}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
            <TaskEditorPreview
              content={content ?? ""}
              previewDueDate={previewDueDate}
              previewStatus={previewStatus}
              previewTags={previewTags}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
};
