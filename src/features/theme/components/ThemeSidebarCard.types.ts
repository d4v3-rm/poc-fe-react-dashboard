import type { ThemeColors, ThemeMode } from "../theme.types";

export type ThemeSidebarCardProps = {
  themeMode: ThemeMode;
  themeColors: ThemeColors;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemeColorsChange: (colors: ThemeColors) => void;
};

export type ThemeModeSelectorProps = Pick<
  ThemeSidebarCardProps,
  "themeMode" | "onThemeModeChange"
> & {
  onReset: () => void;
};

export type ThemeAccentPaletteProps = Pick<
  ThemeSidebarCardProps,
  "themeColors" | "onThemeColorsChange"
>;

export type ThemePreviewProps = Pick<ThemeSidebarCardProps, "themeColors">;

export type ThemeSettingsModalProps = {
  open: boolean;
  themeMode: ThemeMode;
  themeColors: ThemeColors;
  onClose: () => void;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemeColorsChange: (colors: ThemeColors) => void;
};
