import { theme, type ThemeConfig } from 'antd';
import type { ThemeColors, ThemeMode } from '../../store/dashboard-store.types';
import { DEFAULT_THEME_PALETTE } from './color-utils';

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
      colorWarning: '#D99012',
      colorError: '#D84A63',
      colorBgLayout: isDark ? DEFAULT_THEME_PALETTE.dark.layout : DEFAULT_THEME_PALETTE.light.layout,
      colorBgContainer: isDark ? DEFAULT_THEME_PALETTE.dark.panel : DEFAULT_THEME_PALETTE.light.panel,
      colorBgElevated: isDark ? DEFAULT_THEME_PALETTE.dark.panelStrong : DEFAULT_THEME_PALETTE.light.panelStrong,
      borderRadius: 14,
      borderRadiusLG: 18,
      colorTextPlaceholder: isDark ? '#A9B1C4' : '#6B7488',
      colorBorder: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(16, 24, 40, 0.14)',
      colorSplit: isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(16, 24, 40, 0.08)',
      boxShadowTertiary: isDark ? '0 8px 20px rgba(0, 0, 0, 0.35)' : '0 8px 20px rgba(22, 45, 96, 0.10)',
    },
    components: {
      Layout: {
        headerBg: 'transparent',
        bodyBg: 'transparent',
        siderBg: 'transparent',
      },
      Card: {
        bodyPadding: 16,
        colorBgContainer: isDark ? DEFAULT_THEME_PALETTE.dark.panel : DEFAULT_THEME_PALETTE.light.panel,
        colorTextHeading: isDark ? '#F5F7FB' : '#1E2747',
        borderRadiusLG: 18,
        actionsBg: isDark ? '#17233f' : '#F5F8FF',
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
      Tag: {
        defaultBg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(16, 24, 40, 0.06)',
        defaultColor: isDark ? '#E7ECFF' : '#27334F',
      },
      Drawer: {
        paddingLG: 20,
      },
    },
  };
};
