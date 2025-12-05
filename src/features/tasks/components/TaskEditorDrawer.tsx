import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Flex,
  Form,
  Grid,
  Input,
  Row,
  Select,
  Space,
  Tag,
  Tooltip,
  Typography,
  theme,
} from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  semanticTagStyle,
  statusTagStyle,
} from "../../../shared/theme/color-utils";
import { taskFormSchema, type TaskFormValues } from "../task.schema";
import type { TaskItem, TaskStatus } from "../task.types";

type TaskEditorDrawerProps = {
  open: boolean;
  mode: "create" | "edit";
  statuses: TaskStatus[];
  availableTags?: string[];
  initialTask?: TaskItem | null;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    content: string;
    tags: string[];
    statusId: string;
    dueDate: string | null;
  }) => void;
};

const normalizeTags = (tags: string[] = []) =>
  Array.from(
    new Set(tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)),
  );

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
  const drawerMaskStyle = {
    backgroundColor: "rgba(12, 22, 38, 0.44)",
    backdropFilter: "blur(2px)",
  };
  const screens = Grid.useBreakpoint();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      statusId: statuses[0]?.id ?? "",
      dueDate: null,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      title: initialTask?.title ?? "",
      content: initialTask?.content ?? "",
      tags: normalizeTags(initialTask?.tags),
      statusId: initialTask?.statusId ?? statuses[0]?.id ?? "",
      dueDate: initialTask?.dueDate ? dayjs(initialTask.dueDate) : null,
    });
  }, [
    initialTask?.content,
    initialTask?.dueDate,
    initialTask?.statusId,
    initialTask?.tags,
    initialTask?.title,
    open,
    reset,
    statuses,
  ]);

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
  const previewTags = normalizeTags(selectedTags);
  const previewDueDate = dueDate ? dueDate.format("YYYY-MM-DD") : "";
  const statusPreviewStyle = previewStatus
    ? statusTagStyle(previewStatus.color, token.colorBgContainer)
    : undefined;
  const taskTagStyle = semanticTagStyle(
    token.colorPrimary,
    0.14,
    0.34,
    token.colorBgContainer,
  );

  return (
    <Drawer
      destroyOnHidden
      width="min(860px, 95vw)"
      footer={
        <Flex justify="end">
          <Space>
            <Tooltip title={t("actions.cancel")}>
              <Button
                aria-label={t("actions.cancel")}
                icon={<CloseOutlined />}
                onClick={onClose}
              />
            </Tooltip>
            <Tooltip
              title={mode === "create" ? t("actions.create") : t("actions.save")}
            >
              <Button
                aria-label={
                  mode === "create" ? t("actions.create") : t("actions.save")
                }
                icon={mode === "create" ? <PlusOutlined /> : <CheckOutlined />}
                loading={isSubmitting}
                onClick={handleSubmit((values) => {
                  onSubmit({
                    title: values.title,
                    content: values.content,
                    tags: normalizeTags(values.tags),
                    statusId: values.statusId,
                    dueDate: values.dueDate ? values.dueDate.toISOString() : null,
                  });
                })}
                type="primary"
              />
            </Tooltip>
          </Space>
        </Flex>
      }
      onClose={onClose}
      open={open}
      placement="right"
      size="large"
      title={mode === "create" ? t("task.create") : t("task.edit")}
      styles={{
        root: {
          margin: "12px 12px 12px 0",
        },
        mask: drawerMaskStyle,
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
            <Typography.Text type="secondary">{t("task.preview")}</Typography.Text>
            <Flex gap={6} wrap>
              <Tag bordered={false} style={statusPreviewStyle}>
                {previewStatus?.name ?? t("task.form.status")}
              </Tag>
              <Tag bordered={false}>
                {previewDueDate.length > 0 ? previewDueDate : t("task.form.dueDate")}
              </Tag>
            </Flex>
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
          <div style={{ flex: 1, minWidth: 0, minHeight: 0, marginBottom: screens.lg ? 0 : 12 }}>
            <Card size="small" style={{ height: "100%", overflow: "hidden" }}>
              <Form layout="vertical">
                <Form.Item
                  help={errors.title?.message}
                  label={t("task.form.title")}
                  validateStatus={errors.title ? "error" : ""}
                >
                  <Controller
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <Input
                        {...field}
                        autoFocus
                        placeholder={t("task.form.title")}
                      />
                    )}
                  />
                </Form.Item>

                <Row gutter={12}>
                  <Col span={screens.sm ? 12 : 24}>
                    <Form.Item
                      help={errors.tags?.message}
                      label={t("task.form.tags")}
                      validateStatus={errors.tags ? "error" : ""}
                    >
                      <Controller
                        control={control}
                        name="tags"
                        render={({ field }) => (
                          <Select
                            {...field}
                            allowClear
                            mode="tags"
                            options={availableTags.map((tag) => ({
                              label: tag,
                              value: tag,
                            }))}
                            placeholder={t("task.form.tags")}
                            onChange={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={screens.sm ? 12 : 24}>
                    <Form.Item
                      help={errors.statusId?.message}
                      label={t("task.form.status")}
                      validateStatus={errors.statusId ? "error" : ""}
                    >
                      <Controller
                        control={control}
                        name="statusId"
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={statuses.map((status) => ({
                              label: status.name,
                              value: status.id,
                            }))}
                          />
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={12}>
                  <Col span={screens.sm ? 12 : 24}>
                    <Form.Item
                      help={errors.dueDate?.message as string | undefined}
                      label={t("task.form.dueDate")}
                      validateStatus={errors.dueDate ? "error" : ""}
                    >
                      <Controller
                        control={control}
                        name="dueDate"
                        render={({ field }) => (
                          <DatePicker
                            allowClear
                            format="YYYY-MM-DD"
                            onChange={(value) => field.onChange(value ?? null)}
                            style={{ width: "100%" }}
                            value={field.value}
                          />
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  help={errors.content?.message}
                  label={
                    <Space orientation="vertical" size={0}>
                      <span>{t("task.form.content")}</span>
                      <Typography.Text type="secondary">
                        {t("task.form.markdownHint")}
                      </Typography.Text>
                    </Space>
                  }
                  validateStatus={errors.content ? "error" : ""}
                >
                  <Controller
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <Input.TextArea
                        {...field}
                        autoSize={{ minRows: 10, maxRows: 18 }}
                      />
                    )}
                  />
                </Form.Item>
              </Form>
            </Card>
          </div>

          <div style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
            <Card size="small" style={{ height: "100%", overflow: "hidden" }}>
              <Flex gap={8} vertical>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {t("task.preview")}
                </Typography.Title>
                <Flex gap={6} wrap>
                  {previewTags.length === 0 ? (
                    <Typography.Text type="secondary">
                      {t("task.noTags")}
                    </Typography.Text>
                  ) : (
                    previewTags.map((tag) => (
                      <Tag key={tag} style={taskTagStyle}>
                        {tag}
                      </Tag>
                    ))
                  )}
                </Flex>

                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                    padding: 12,
                    overflow: "auto",
                  }}
                >
                  {(content ?? "").trim().length > 0 ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content ?? ""}
                    </ReactMarkdown>
                  ) : (
                    <Typography.Text type="secondary">
                      {t("task.form.markdownHint")}
                    </Typography.Text>
                  )}
                </div>
              </Flex>
            </Card>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
