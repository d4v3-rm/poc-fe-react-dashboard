import {
  BgColorsOutlined,
  MoonOutlined,
  ReloadOutlined,
  SunOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Flex,
  Segmented,
  Space,
  Tooltip,
  Typography,
  theme,
} from "antd";
import { useTranslation } from "react-i18next";
import { getFallbackColor, textColorFor } from "../../shared/theme/color-utils";
import { DEFAULT_THEME_COLORS } from "../../shared/utils/defaults";
import { THEME_COLOR_PRESETS } from "../../shared/utils/defaults";
import type { ThemeColors, ThemeMode } from "../../store/dashboard-store.types";

type ThemeSidebarCardProps = {
  themeMode: ThemeMode;
  themeColors: ThemeColors;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemeColorsChange: (colors: ThemeColors) => void;
};

export const ThemeSidebarCard = ({
  themeMode,
  themeColors,
  onThemeModeChange,
  onThemeColorsChange,
}: ThemeSidebarCardProps) => {
  const { token } = theme.useToken();
  const { t } = useTranslation();

  const applyColor = (color: string) => {
    onThemeColorsChange({
      primary: color,
    });
  };

  const resetColors = () => {
    onThemeColorsChange({
      primary: DEFAULT_THEME_COLORS.primary,
    });
  };

  const renderPalette = () => (
    <Flex gap={7} vertical>
      <Space size={6} align="center">
        <BgColorsOutlined />
        <Typography.Text
          style={{ color: token.colorTextSecondary, fontSize: 12 }}
        >
          {t("theme.accent")}
        </Typography.Text>
      </Space>

      <Space size={8} wrap>
        {THEME_COLOR_PRESETS.map((color) => {
          const isSelected = themeColors.primary.toLowerCase() === color.toLowerCase();
          const safeColor = getFallbackColor(color);

          return (
            <Tooltip
              key={color}
              title={`${t("theme.accent")}: ${color}`}
            >
              <Button
                aria-label={`${t("theme.accent")}: ${safeColor}`}
                onClick={() => applyColor(safeColor)}
                shape="circle"
                size="small"
                style={{
                  alignItems: "center",
                  backgroundColor: safeColor,
                  borderColor: isSelected
                    ? token.colorPrimary
                    : token.colorBorder,
                  boxShadow: isSelected
                    ? `0 0 0 2px ${token.colorBgContainer}, 0 2px 12px ${token.colorBgMask}`
                    : "none",
                  color: textColorFor(safeColor),
                  height: 24,
                  minWidth: 24,
                  padding: 0,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  width: 24,
                }}
                onMouseDown={(event) => event.preventDefault()}
              />
            </Tooltip>
          );
        })}
      </Space>
    </Flex>
  );

  return (
    <Flex gap={12} vertical style={{ width: "100%" }}>
      <Flex align="center" justify="space-between">
        <Flex gap={6} align="center" style={{ minWidth: 0 }}>
          <Typography.Text strong>{t("theme.mode.label")}</Typography.Text>
          <Segmented
            onChange={(value) => onThemeModeChange(value as ThemeMode)}
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
            onClick={resetColors}
            size="small"
            type="text"
          />
        </Tooltip>
      </Flex>

      <Divider style={{ margin: "2px 0" }} />
      {renderPalette()}

      <Divider style={{ margin: "2px 0" }} />

      <Flex gap={10} vertical>
        <Typography.Text
          style={{ color: token.colorTextSecondary, fontSize: 12 }}
        >
          {t("theme.preview")}
        </Typography.Text>
        <Flex align="center" gap={8}>
          <Button
            aria-label={`${t("theme.accent")}: ${getFallbackColor(themeColors.primary)}`}
            shape="circle"
            size="small"
            style={{
              backgroundColor: getFallbackColor(themeColors.primary),
              borderColor: token.colorBorder,
              color: textColorFor(themeColors.primary),
              height: 24,
              minWidth: 24,
              padding: 0,
              width: 24,
            }}
          />
          <Flex style={{ marginLeft: 6 }} vertical>
            <Typography.Text strong style={{ fontSize: 12 }}>
              {t("theme.previewName")}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              {t("theme.previewHint")}
            </Typography.Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
