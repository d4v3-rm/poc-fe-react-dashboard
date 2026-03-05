import { BgColorsOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Tooltip, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import { THEME_COLOR_PRESETS } from "../theme.constants";
import {
  getFallbackColor,
  textColorFor,
} from "../../../shared/theme/color-utils";
import type { ThemeAccentPaletteProps } from "./ThemeSidebarCard.types";

export const ThemeAccentPalette = ({
  themeColors,
  onThemeColorsChange,
}: ThemeAccentPaletteProps) => {
  const { token } = theme.useToken();
  const { t } = useTranslation();

  const applyColor = (color: string) => {
    onThemeColorsChange({
      primary: color,
    });
  };

  return (
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
          const isSelected =
            themeColors.primary.toLowerCase() === color.toLowerCase();
          const safeColor = getFallbackColor(color);

          return (
            <Tooltip key={color} title={`${t("theme.accent")}: ${color}`}>
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
};
