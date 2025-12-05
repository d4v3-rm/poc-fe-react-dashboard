import type { ThemeConfig } from 'antd';

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0D8BFF',
    colorInfo: '#0D8BFF',
    colorSuccess: '#1FA77A',
    colorWarning: '#E89D1B',
    colorError: '#E6485D',
    borderRadius: 14,
    borderRadiusLG: 18,
    colorBgLayout: '#EEF4FF',
    colorBgContainer: '#FFFFFF',
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
      itemSelectedBg: '#0D8BFF',
      itemSelectedColor: '#FFFFFF',
    },
    Drawer: {
      paddingLG: 20,
    },
  },
};
