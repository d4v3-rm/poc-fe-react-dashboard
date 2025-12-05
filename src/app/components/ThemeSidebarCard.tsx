import {
  BgColorsOutlined,
  CheckOutlined,
  HighlightOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Button, Card, Flex, Segmented, Space, Tooltip, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { THEME_COLOR_PRESETS } from '../../shared/utils/defaults';
import type { ThemeColors, ThemeMode } from '../../store/dashboard-store.types';

type ThemeSidebarCardProps = {
  compact?: boolean;
  themeMode: ThemeMode;
  themeColors: ThemeColors;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemeColorsChange: (colors: ThemeColors) => void;
};

const nextPaletteColor = (current: string): string => {
  const currentIndex = THEME_COLOR_PRESETS.findIndex(
    (color) => color.toLowerCase() === current.toLowerCase(),
  );

  if (currentIndex < 0 || currentIndex === THEME_COLOR_PRESETS.length - 1) {
    return THEME_COLOR_PRESETS[0];
  }

  return THEME_COLOR_PRESETS[currentIndex + 1];
};

export const ThemeSidebarCard = ({
  compact = false,
  themeMode,
  themeColors,
  onThemeModeChange,
  onThemeColorsChange,
}: ThemeSidebarCardProps) => {
  const { token } = theme.useToken();
  const { t } = useTranslation();

  const applyColor = (target: 'primary' | 'secondary', color: string) => {
    onThemeColorsChange({
      ...themeColors,
      [target]: color,
    });
  };

  if (compact) {
    return (
      <Card size="small">
        <Flex align="center" gap={8} vertical>
          <Tooltip title={themeMode === 'dark' ? t('theme.mode.light') : t('theme.mode.dark')}>
            <Button
              aria-label={themeMode === 'dark' ? t('theme.mode.light') : t('theme.mode.dark')}
              icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
              shape="circle"
            />
          </Tooltip>

          <Tooltip title={`${t('theme.primary')}: ${themeColors.primary}`}>
            <Button
              aria-label={`${t('theme.primary')}: ${themeColors.primary}`}
              icon={<BgColorsOutlined />}
              onClick={() => applyColor('primary', nextPaletteColor(themeColors.primary))}
              shape="circle"
              style={{
                backgroundColor: themeColors.primary,
                color: '#FFFFFF',
              }}
            />
          </Tooltip>

          <Tooltip title={`${t('theme.secondary')}: ${themeColors.secondary}`}>
            <Button
              aria-label={`${t('theme.secondary')}: ${themeColors.secondary}`}
              icon={<HighlightOutlined />}
              onClick={() => applyColor('secondary', nextPaletteColor(themeColors.secondary))}
              shape="circle"
              style={{
                backgroundColor: themeColors.secondary,
                color: '#FFFFFF',
              }}
            />
          </Tooltip>
        </Flex>
      </Card>
    );
  }

  const renderPalette = (target: 'primary' | 'secondary') => (
    <Space size={6} wrap>
      {THEME_COLOR_PRESETS.map((color) => {
        const isSelected = themeColors[target].toLowerCase() === color.toLowerCase();

        return (
          <Tooltip key={`${target}-${color}`} title={`${target === 'primary' ? t('theme.primary') : t('theme.secondary')}: ${color}`}>
            <Button
              aria-label={`${target === 'primary' ? t('theme.primary') : t('theme.secondary')}: ${color}`}
              icon={isSelected ? <CheckOutlined /> : undefined}
              onClick={() => applyColor(target, color)}
              shape="circle"
              size="small"
              style={{
                backgroundColor: color,
                borderColor: isSelected ? token.colorText : token.colorBorderSecondary,
                color: '#FFFFFF',
                boxShadow: isSelected ? `0 0 0 2px ${token.colorBgContainer}` : 'none',
              }}
            />
          </Tooltip>
        );
      })}
    </Space>
  );

  return (
    <Card size="small">
      <Flex gap={10} vertical>
        <Segmented
          onChange={(value) => onThemeModeChange(value as ThemeMode)}
          options={[
            {
              label: (
                <Tooltip title={t('theme.mode.light')}>
                  <SunOutlined />
                </Tooltip>
              ),
              value: 'light',
            },
            {
              label: (
                <Tooltip title={t('theme.mode.dark')}>
                  <MoonOutlined />
                </Tooltip>
              ),
              value: 'dark',
            },
          ]}
          value={themeMode}
        />

        <Flex align="center" gap={8}>
          <Tooltip title={t('theme.primary')}>
            <BgColorsOutlined />
          </Tooltip>
          {renderPalette('primary')}
        </Flex>

        <Flex align="center" gap={8}>
          <Tooltip title={t('theme.secondary')}>
            <HighlightOutlined />
          </Tooltip>
          {renderPalette('secondary')}
        </Flex>
      </Flex>
    </Card>
  );
};
