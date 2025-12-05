import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Modal,
  Space,
  Typography,
  Tooltip,
  theme,
} from "antd";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { projectFormSchema, type ProjectFormValues } from "../project.schema";

type ProjectFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<ProjectFormValues>;
  onCancel: () => void;
  onSubmit: (values: ProjectFormValues) => void;
};

const defaultValues: ProjectFormValues = {
  name: "",
  description: "",
};

export const ProjectFormModal = ({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: ProjectFormModalProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
    });
  }, [initialValues?.description, initialValues?.name, open, reset]);

  return (
    <Modal
      destroyOnHidden
      open={open}
      onCancel={onCancel}
      centered
      width="min(560px, 95vw)"
      title={null}
      styles={{
        wrapper: {
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowSecondary,
          background: token.colorBgElevated,
          overflow: "hidden",
        },
        body: {
          borderRadius: token.borderRadiusLG,
          background: token.colorBgElevated,
          padding: 0,
          overflow: "visible",
        },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: "12px 16px 14px",
        },
      }}
      footer={[
        <Tooltip key="cancel" title={t("actions.cancel")}>
          <Button
            aria-label={t("actions.cancel")}
            icon={<CloseOutlined />}
            onClick={onCancel}
          />
        </Tooltip>,
        <Tooltip
          key="save"
          title={mode === "create" ? t("actions.create") : t("actions.save")}
        >
          <Button
            aria-label={
              mode === "create" ? t("actions.create") : t("actions.save")
            }
            icon={mode === "create" ? <PlusOutlined /> : <CheckOutlined />}
            loading={isSubmitting}
            onClick={handleSubmit((values) => onSubmit(values))}
            type="primary"
          />
        </Tooltip>,
      ]}
    >
      <div
        style={{
          padding: "16px 18px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Space>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {mode === "create" ? t("project.create") : t("project.edit")}
          </Typography.Title>
        </Space>
      </div>
      <Form
        layout="vertical"
        onFinish={handleSubmit((values) => onSubmit(values))}
      >
        <Form.Item
          label={t("project.form.name")}
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                {...field}
                autoFocus
                placeholder={t("project.form.name")}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label={t("project.form.description")}
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.message}
        >
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Input.TextArea
                {...field}
                autoSize={{ minRows: 3, maxRows: 6 }}
                placeholder={t("project.form.description")}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
