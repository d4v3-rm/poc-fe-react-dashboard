import { MoonOutlined, ReloadOutlined, SunOutlined } from "@ant-design/icons";
import { Button, Divider, Flex, Segmented, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";
import type { ThemeModeSelectorProps } from "./ThemeSidebarCard.types";

export const ThemeModeSelector = ({
  themeMode,
  onThemeModeChange,
  onReset,
}: ThemeModeSelectorProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Flex align="center" justify="space-between">
        <Flex gap={6} align="center" style={{ minWidth: 0 }}>
          <Typography.Text strong>{t("theme.mode.label")}</Typography.Text>
          <Segmented
            onChange={(value) => onThemeModeChange(value as typeof themeMode)}
            options={[
              {
                icon: <SunOutlined />,
                value: "light",
              },
              {
                icon: <MoonOutlined />,
                value: "dark",
              },
            ]}
            value={themeMode}
            block
          />
        </Flex>

        <Tooltip title={t("theme.reset")}>
          <Button
            aria-label={t("theme.reset")}
            icon={<ReloadOutlined />}
            onClick={onReset}
            size="small"
            type="text"
          />
        </Tooltip>
      </Flex>

      <Divider style={{ margin: "2px 0" }} />
    </>
  );
};
