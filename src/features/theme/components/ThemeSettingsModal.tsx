import { Button, Divider, Flex, Modal, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import { OVERLAY_MASK_STYLE } from "../../../shared/ui/overlay.styles";
import { ThemeSidebarCard } from "./ThemeSidebarCard";
import type { ThemeSettingsModalProps } from "./ThemeSidebarCard.types";

export const ThemeSettingsModal = ({
  open,
  themeMode,
  themeColors,
  onClose,
  onThemeModeChange,
  onThemeColorsChange,
}: ThemeSettingsModalProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <Modal
      centered
      footer={null}
      onCancel={onClose}
      open={open}
      width="min(520px, 95vw)"
      styles={{
        mask: OVERLAY_MASK_STYLE,
        container: {
          background: token.colorBgContainer,
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowSecondary,
          overflow: "hidden",
        },
        body: {
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          padding: 0,
          overflow: "auto",
        },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
        },
      }}
    >
      <div
        style={{
          padding: "16px 18px",
          borderBottom: `1px solid ${token.colorBorder}`,
        }}
      >
        <Flex align="center" gap={8}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {t("theme.settings")}
          </Typography.Title>
        </Flex>
        <Typography.Text type="secondary">
          {t("theme.sectionDescription")}
        </Typography.Text>
      </div>

      <div style={{ padding: 16 }}>
        <ThemeSidebarCard
          onThemeColorsChange={onThemeColorsChange}
          onThemeModeChange={onThemeModeChange}
          themeColors={themeColors}
          themeMode={themeMode}
        />
      </div>

      <Divider style={{ margin: 0 }} />

      <Flex justify="end" style={{ padding: 14 }}>
        <Button onClick={onClose}>{t("actions.close")}</Button>
      </Flex>
    </Modal>
  );
};
