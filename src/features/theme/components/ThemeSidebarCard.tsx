import { Flex } from "antd";
import { DEFAULT_THEME_COLORS } from "../theme.constants";
import { ThemeAccentPalette } from "./ThemeAccentPalette";
import { ThemeModeSelector } from "./ThemeModeSelector";
import { ThemePreview } from "./ThemePreview";
import type { ThemeSidebarCardProps } from "./ThemeSidebarCard.types";

export const ThemeSidebarCard = ({
  themeMode,
  themeColors,
  onThemeModeChange,
  onThemeColorsChange,
}: ThemeSidebarCardProps) => {
  const resetColors = () => {
    onThemeColorsChange({
      primary: DEFAULT_THEME_COLORS.primary,
    });
  };

  return (
    <Flex gap={12} vertical style={{ width: "100%" }}>
      <ThemeModeSelector
        onReset={resetColors}
        onThemeModeChange={onThemeModeChange}
        themeMode={themeMode}
      />
      <ThemeAccentPalette
        onThemeColorsChange={onThemeColorsChange}
        themeColors={themeColors}
      />
      <ThemePreview themeColors={themeColors} />
    </Flex>
  );
};
