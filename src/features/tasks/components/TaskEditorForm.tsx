import {
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TaskEditorFormProps } from "./TaskEditorDrawer.types";

export const TaskEditorForm = ({
  control,
  errors,
  statuses,
  availableTags,
  isWideLayout,
}: TaskEditorFormProps) => {
  const { t } = useTranslation();

  return (
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
              <Input {...field} autoFocus placeholder={t("task.form.title")} />
            )}
          />
        </Form.Item>

        <Row gutter={12}>
          <Col span={isWideLayout ? 12 : 24}>
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
                    onChange={(value) => field.onChange(value)}
                    options={availableTags.map((tag) => ({
                      label: tag,
                      value: tag,
                    }))}
                    placeholder={t("task.form.tags")}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={isWideLayout ? 12 : 24}>
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
          <Col span={isWideLayout ? 12 : 24}>
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
            <Space direction="vertical" size={0}>
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
  );
};
