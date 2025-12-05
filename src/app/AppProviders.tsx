import { App as AntdApp, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import itIT from "antd/locale/it_IT";
import dayjs from "dayjs";
import "dayjs/locale/en";
import "dayjs/locale/it";
import { useEffect, useMemo, type ReactNode } from "react";
import { AppGlobalStyles } from "./AppGlobalStyles.style";
import { i18n } from "../shared/i18n/i18n";
import {
  DEFAULT_THEME_PALETTE,
  getFallbackColor,
  toRgba,
} from "../shared/theme/color-utils";
import { buildAppTheme } from "../shared/theme/app-theme";
import { useDashboardStore } from "../store/dashboard-store";

type AppProvidersProps = {
  children: ReactNode;
};

const antdLocales = {
  en: enUS,
  it: itIT,
} as const;

export const AppProviders = ({ children }: AppProvidersProps) => {
  const language = useDashboardStore((state) => state.language);
  const themeMode = useDashboardStore((state) => state.themeMode);
  const themeColors = useDashboardStore((state) => state.themeColors);
  const appTheme = useMemo(
    () =>
      buildAppTheme({
        mode: themeMode,
        colors: themeColors,
      }),
    [themeColors, themeMode],
  );

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }

    dayjs.locale(language);
  }, [language]);

  useEffect(() => {
    const root = document.documentElement;
    const trackColor =
      themeMode === "dark"
        ? "rgba(255, 255, 255, 0.06)"
        : "rgba(16, 24, 40, 0.10)";
    const safePrimary = getFallbackColor(themeColors.primary);
    const safeSecondary = getFallbackColor(themeColors.secondary);
    const thumbColor = toRgba(safePrimary, themeMode === "dark" ? 0.52 : 0.44);
    const thumbHover = toRgba(safePrimary, themeMode === "dark" ? 0.72 : 0.6);
    const thumbStrong = toRgba(
      safeSecondary,
      themeMode === "dark" ? 0.82 : 0.72,
    );

    document.body.style.backgroundColor =
      themeMode === "dark"
        ? DEFAULT_THEME_PALETTE.dark.layout
        : DEFAULT_THEME_PALETTE.light.layout;
    root.style.setProperty("--app-scrollbar-track", trackColor);
    root.style.setProperty("--app-scrollbar-thumb", thumbColor);
    root.style.setProperty("--app-scrollbar-thumb-hover", thumbHover);
    root.style.setProperty("--app-scrollbar-thumb-strong", thumbStrong);
    root.style.setProperty("--app-accent-color", safePrimary);
    root.style.setProperty("--app-accent-secondary", safeSecondary);
  }, [themeColors.primary, themeColors.secondary, themeMode]);

  return (
    <ConfigProvider locale={antdLocales[language]} theme={appTheme}>
      <AntdApp>
        <AppGlobalStyles />
        {children}
      </AntdApp>
    </ConfigProvider>
  );
};
