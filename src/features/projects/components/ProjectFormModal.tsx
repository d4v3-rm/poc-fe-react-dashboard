import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Select,
  Modal,
  Space,
  Typography,
  Tooltip,
  theme,
} from "antd";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createProjectFormSchema,
  type ProjectFormValues,
} from "../project.schema";

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
  tags: [],
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
  const schema = useMemo(() => createProjectFormSchema(t), [t]);
  const modalMaskStyle = {
    backgroundColor: "rgba(12, 22, 38, 0.44)",
    backdropFilter: "blur(2px)",
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      tags: initialValues?.tags ?? [],
    });
  }, [
    initialValues?.description,
    initialValues?.name,
    initialValues?.tags,
    open,
    reset,
  ]);

  return (
    <Modal
      destroyOnHidden
      open={open}
      onCancel={onCancel}
      centered
      width="min(560px, 95vw)"
      title={null}
      styles={{
        mask: modalMaskStyle,
        container: {
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowSecondary,
          background: token.colorBgContainer,
          overflow: "hidden",
        },
        body: {
          borderRadius: token.borderRadiusLG,
          background: token.colorBgContainer,
          padding: 0,
          overflow: "visible",
        },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: "12px 16px 14px",
          background: token.colorBgContainer,
        },
      }}
      footer={[
        <Tooltip key="cancel" title={t("actions.cancel")}>
          <Button
            aria-label={t("actions.cancel")}
            icon={<CloseOutlined />}
            onClick={onCancel}
          >
            {t("actions.cancel")}
          </Button>
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
          >
            {mode === "create" ? t("actions.create") : t("actions.save")}
          </Button>
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
      <div style={{ padding: "16px 18px 4px" }}>
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

          <Form.Item
            label={t("project.form.tags")}
            validateStatus={errors.tags ? "error" : ""}
            help={errors.tags?.message}
          >
            <Controller
              control={control}
              name="tags"
              render={({ field }) => (
                <Select
                  {...field}
                  allowClear
                  mode="tags"
                  options={(initialValues?.tags ?? []).map((tag) => ({
                    label: tag,
                    value: tag,
                  }))}
                  placeholder={t("project.form.tags")}
                  onChange={(value) => field.onChange(value ?? [])}
                />
              )}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
