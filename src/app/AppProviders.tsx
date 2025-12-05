import { App as AntdApp, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import itIT from 'antd/locale/it_IT';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/it';
import { useEffect, useMemo, type ReactNode } from 'react';
import { AppGlobalStyles } from './AppGlobalStyles.style';
import { i18n } from '../shared/i18n/i18n';
import { buildAppTheme } from '../shared/theme/app-theme';
import { useDashboardStore } from '../store/dashboard-store';

type AppProvidersProps = {
  children: ReactNode;
};

const antdLocales = {
  en: enUS,
  it: itIT,
} as const;

const hexToRgba = (hexColor: string, alpha: number): string => {
  const normalized = hexColor.replace('#', '');
  const validHex =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized;

  if (!/^[0-9a-fA-F]{6}$/.test(validHex)) {
    return `rgba(13, 139, 255, ${alpha})`;
  }

  const red = Number.parseInt(validHex.slice(0, 2), 16);
  const green = Number.parseInt(validHex.slice(2, 4), 16);
  const blue = Number.parseInt(validHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

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
    const trackColor = themeMode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(14, 25, 46, 0.09)';
    const thumbColor = hexToRgba(themeColors.primary, themeMode === 'dark' ? 0.52 : 0.44);
    const thumbHover = hexToRgba(themeColors.primary, themeMode === 'dark' ? 0.72 : 0.6);
    const thumbStrong = hexToRgba(themeColors.secondary, themeMode === 'dark' ? 0.82 : 0.72);

    document.body.style.backgroundColor = themeMode === 'dark' ? '#12161F' : '#EEF4FF';
    root.style.setProperty('--app-scrollbar-track', trackColor);
    root.style.setProperty('--app-scrollbar-thumb', thumbColor);
    root.style.setProperty('--app-scrollbar-thumb-hover', thumbHover);
    root.style.setProperty('--app-scrollbar-thumb-strong', thumbStrong);
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
