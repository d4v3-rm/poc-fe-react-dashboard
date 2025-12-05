import { App as AntdApp, ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import itIT from 'antd/locale/it_IT';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/it';
import { useEffect, type ReactNode } from 'react';
import { i18n } from '../shared/i18n/i18n';
import { appTheme } from '../shared/theme/app-theme';
import { useDashboardStore } from '../store/dashboard-store';

type AppProvidersProps = {
  children: ReactNode;
};

const antdLocales = {
  en: enUS,
  it: itIT,
} as const;

export const AppProviders = ({ children }: AppProvidersProps) => {
  const language = useDashboardStore((state) => state.language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }

    dayjs.locale(language);
  }, [language]);

  return (
    <ConfigProvider locale={antdLocales[language]} theme={appTheme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
};
