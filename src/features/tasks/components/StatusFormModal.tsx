import { zodResolver } from "@hookform/resolvers/zod";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
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
  getFallbackColor,
  textColorFor,
} from "../../../shared/theme/color-utils";
import { OVERLAY_MASK_STYLE } from "../../../shared/ui/overlay.styles";
import {
  createStatusFormSchema,
  type StatusFormValues,
} from "../status-form.schema";
import {
  DEFAULT_THEME_COLORS,
  THEME_COLOR_PRESETS,
} from "../../theme/theme.constants";
import type { StatusFormModalProps } from "./StatusFormModal.types";

const defaultValues: StatusFormValues = {
  name: "",
  color: DEFAULT_THEME_COLORS.primary,
};

export const StatusFormModal = ({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: StatusFormModalProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const schema = useMemo(() => createStatusFormSchema(t), [t]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StatusFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: initialValues?.name ?? "",
      color: initialValues?.color ?? DEFAULT_THEME_COLORS.primary,
    });
  }, [initialValues?.color, initialValues?.name, open, reset]);

  return (
    <Modal
      destroyOnHidden
      open={open}
      onCancel={onCancel}
      centered
      width="min(520px, 95vw)"
      title={null}
      styles={{
        mask: OVERLAY_MASK_STYLE,
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
            {mode === "create" ? t("kanban.addStatus") : t("kanban.editStatus")}
          </Typography.Title>
        </Space>
      </div>
      <div style={{ padding: "16px 18px 4px" }}>
        <Form
          layout="vertical"
          onFinish={handleSubmit((values) => onSubmit(values))}
        >
          <Form.Item
            label={t("kanban.statusForm.name")}
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              control={control}
              name="name"
              render={({ field }) => <Input {...field} autoFocus />}
            />
          </Form.Item>

          <Form.Item
            label={t("kanban.statusForm.color")}
            validateStatus={errors.color ? "error" : ""}
            help={errors.color?.message}
          >
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <Flex gap={12} vertical>
                  <Flex gap={10} wrap>
                    {THEME_COLOR_PRESETS.map((color) => {
                      const safeColor = getFallbackColor(color);
                      const isSelected =
                        field.value.toLowerCase() === safeColor.toLowerCase();

                      return (
                        <Tooltip key={safeColor} title={safeColor}>
                          <Button
                            aria-label={`${t("kanban.statusForm.color")}: ${safeColor}`}
                            onClick={() => field.onChange(safeColor)}
                            onMouseDown={(event) => event.preventDefault()}
                            shape="circle"
                            size="small"
                            style={{
                              backgroundColor: safeColor,
                              borderColor: isSelected
                                ? token.colorPrimary
                                : token.colorBorder,
                              boxShadow: isSelected
                                ? `0 0 0 2px ${token.colorBgContainer}, 0 2px 12px ${token.colorBgMask}`
                                : "none",
                              color: textColorFor(safeColor),
                              height: 30,
                              minWidth: 30,
                              padding: 0,
                              width: 30,
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                  </Flex>

                  <Input
                    readOnly
                    value={getFallbackColor(field.value)}
                    aria-label={t("kanban.statusForm.color")}
                  />
                </Flex>
              )}
            />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
