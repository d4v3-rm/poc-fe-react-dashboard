import { theme, type ThemeConfig } from 'antd';
import type { ThemeColors, ThemeMode } from '../../store/dashboard-store.types';

type BuildThemeInput = {
  mode: ThemeMode;
  colors: ThemeColors;
};

export const buildAppTheme = ({ mode, colors }: BuildThemeInput): ThemeConfig => {
  const isDark = mode === 'dark';

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: colors.primary,
      colorInfo: colors.primary,
      colorSuccess: colors.secondary,
      colorWarning: '#E89D1B',
      colorError: '#E6485D',
      borderRadius: 14,
      borderRadiusLG: 18,
      colorBgLayout: isDark ? '#12161F' : '#EEF4FF',
      colorBgContainer: isDark ? '#1A2233' : '#FFFFFF',
    },
    components: {
      Layout: {
        headerBg: 'transparent',
        bodyBg: 'transparent',
        siderBg: 'transparent',
      },
      Card: {
        bodyPadding: 16,
        borderRadiusLG: 18,
      },
      Button: {
        borderRadius: 12,
        controlHeight: 38,
        fontWeight: 600,
      },
      Input: {
        borderRadius: 12,
        controlHeight: 40,
      },
      Select: {
        borderRadius: 12,
        controlHeight: 40,
      },
      Segmented: {
        borderRadius: 12,
        itemSelectedBg: colors.primary,
        itemSelectedColor: '#FFFFFF',
      },
      Drawer: {
        paddingLG: 20,
      },
    },
  };
};
