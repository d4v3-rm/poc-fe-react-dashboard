import {
  BgColorsOutlined,
  CheckOutlined,
  HighlightOutlined,
  MoonOutlined,
  ReloadOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Button, Card, Divider, Flex, Segmented, Space, Tooltip, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { THEME_COLOR_PRESETS } from '../../shared/utils/defaults';
import type { ThemeColors, ThemeMode } from '../../store/dashboard-store.types';

const PRESET_PRIMARY = '#0D8BFF';
const PRESET_SECONDARY = '#1FA77A';

const nextPaletteColor = (current: string): string => {
  const currentIndex = THEME_COLOR_PRESETS.findIndex((color) => color.toLowerCase() === current.toLowerCase());

  if (currentIndex < 0 || currentIndex === THEME_COLOR_PRESETS.length - 1) {
    return THEME_COLOR_PRESETS[0];
  }

  return THEME_COLOR_PRESETS[currentIndex + 1];
};

const textColorFor = (hex: string): string => {
  const normalized = hex.replace('#', '');
  const isValid = /^[0-9a-fA-F]{6}$/.test(normalized);
  if (!isValid) {
    return '#ffffff';
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;

  return luminance > 145 ? '#1f1f1f' : '#ffffff';
};

type ThemeSidebarCardProps = {
  compact?: boolean;
  themeMode: ThemeMode;
  themeColors: ThemeColors;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemeColorsChange: (colors: ThemeColors) => void;
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

  const resetColors = () => {
    onThemeColorsChange({
      primary: PRESET_PRIMARY,
      secondary: PRESET_SECONDARY,
    });
  };

  if (compact) {
    return (
      <Card size="small">
        <Flex align="center" gap={8} justify="center" vertical>
          <Tooltip title={themeMode === 'dark' ? t('theme.mode.light') : t('theme.mode.dark')}>
            <Button
              aria-label={themeMode === 'dark' ? t('theme.mode.light') : t('theme.mode.dark')}
              icon={themeMode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
              shape="circle"
            />
          </Tooltip>

          <Flex align="center" gap={4}>
            <Tooltip title={`${t('theme.primary')}: ${themeColors.primary}`}>
              <Button
                aria-label={`${t('theme.primary')}: ${themeColors.primary}`}
                icon={<BgColorsOutlined />}
                onClick={() => applyColor('primary', nextPaletteColor(themeColors.primary))}
                shape="circle"
                style={{
                  backgroundColor: themeColors.primary,
                  borderColor: token.colorBorder,
                  color: textColorFor(themeColors.primary),
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
                  borderColor: token.colorBorder,
                  color: textColorFor(themeColors.secondary),
                }}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Card>
    );
  }

  const renderPalette = (target: 'primary' | 'secondary') => (
    <Flex gap={7} vertical>
      <Space size={6} align="center">
        {target === 'primary' ? <BgColorsOutlined /> : <HighlightOutlined />}
        <Typography.Text style={{ color: token.colorTextSecondary, fontSize: 12 }}>
          {target === 'primary' ? t('theme.primary') : t('theme.secondary')}
        </Typography.Text>
      </Space>

      <Space size={8} wrap>
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
                  alignItems: 'center',
                  backgroundColor: color,
                  borderColor: isSelected ? token.colorPrimary : token.colorBorder,
                  boxShadow: isSelected
                    ? `0 0 0 2px ${token.colorBgContainer}, 0 2px 12px ${token.colorBgMask}`
                    : 'none',
                  color: textColorFor(color),
                  height: 24,
                  minWidth: 24,
                  padding: 0,
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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

  return (
    <Card
      size="small"
      styles={{
        body: {
          paddingTop: 10,
          paddingBottom: 10,
        },
      }}
    >
      <Flex gap={10} vertical>
        <Flex align="center" justify="space-between">
          <Segmented
            onChange={(value) => onThemeModeChange(value as ThemeMode)}
            options={[
              {
                label: <SunOutlined />,
                value: 'light',
              },
              {
                label: <MoonOutlined />,
                value: 'dark',
              },
            ]}
            value={themeMode}
          />

          <Tooltip title={t('theme.reset')}>
            <Button
              aria-label={t('theme.reset')}
              icon={<ReloadOutlined />}
              onClick={resetColors}
              size="small"
              type="text"
            />
          </Tooltip>
        </Flex>

        <Divider style={{ margin: '2px 0' }} />

        {renderPalette('primary')}
        <Divider style={{ margin: '2px 0' }} />
        {renderPalette('secondary')}

        <Flex align="center" gap={6} justify="center">
          <Tooltip title={`${t('theme.primary')}: ${themeColors.primary}`}>
            <Button
              aria-label={`${t('theme.primary')}: ${themeColors.primary}`}
              shape="circle"
              size="small"
              style={{
                backgroundColor: themeColors.primary,
                borderColor: token.colorBorder,
                color: textColorFor(themeColors.primary),
                height: 20,
                minWidth: 20,
                padding: 0,
                width: 20,
              }}
            />
          </Tooltip>
          <Typography.Text style={{ color: token.colorTextSecondary, fontSize: 12 }}>/</Typography.Text>
          <Tooltip title={`${t('theme.secondary')}: ${themeColors.secondary}`}>
            <Button
              aria-label={`${t('theme.secondary')}: ${themeColors.secondary}`}
              shape="circle"
              size="small"
              style={{
                backgroundColor: themeColors.secondary,
                borderColor: token.colorBorder,
                color: textColorFor(themeColors.secondary),
                height: 20,
                minWidth: 20,
                padding: 0,
                width: 20,
              }}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Card>
  );
};
