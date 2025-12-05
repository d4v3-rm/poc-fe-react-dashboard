import { ClearOutlined, DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, ColorPicker, Flex, Input, Segmented, Select, Space, Tooltip, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import type { TaskStatus, ViewMode } from '../../features/tasks/task.types';
import { THEME_COLOR_PRESETS } from '../../shared/utils/defaults';
import type { TaskFilters, ThemeColors, ThemeMode } from '../../store/dashboard-store.types';

type DashboardToolbarProps = {
  viewMode: ViewMode;
  filters: TaskFilters;
  statuses: TaskStatus[];
  language: 'en' | 'it';
  themeMode: ThemeMode;
  themeColors: ThemeColors;
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (statusIds: string[]) => void;
  onDueFilterChange: (due: TaskFilters['due']) => void;
  onClearFilters: () => void;
  onLanguageChange: (language: 'en' | 'it') => void;
  onThemeModeChange: (mode: ThemeMode) => void;
  onThemeColorsChange: (colors: ThemeColors) => void;
  onCreateTask: () => void;
  onImport: () => void;
  onExport: () => void;
};

export const DashboardToolbar = ({
  viewMode,
  filters,
  statuses,
  language,
  themeMode,
  themeColors,
  onViewModeChange,
  onSearchChange,
  onStatusFilterChange,
  onDueFilterChange,
  onClearFilters,
  onLanguageChange,
  onThemeModeChange,
  onThemeColorsChange,
  onCreateTask,
  onImport,
  onExport,
}: DashboardToolbarProps) => {
  const { t } = useTranslation();

  return (
    <Flex
      align="center"
      gap={12}
      justify="space-between"
      style={{
        flexWrap: 'wrap',
      }}
      vertical={false}
    >
      <Flex align="center" gap={10} style={{ flex: 1, flexWrap: 'wrap', minWidth: 0 }}>
        <Segmented
          onChange={(value) => onViewModeChange(value as ViewMode)}
          options={[
            { label: t('view.list'), value: 'list' },
            { label: t('view.kanban'), value: 'kanban' },
          ]}
          value={viewMode}
        />

        <Input.Search
          allowClear
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('filters.search')}
          style={{ minWidth: 220, width: 'min(340px, 80vw)' }}
          value={filters.query}
        />

        <Select
          allowClear
          mode="multiple"
          onChange={onStatusFilterChange}
          options={statuses.map((status) => ({
            label: status.name,
            value: status.id,
          }))}
          placeholder={t('filters.status')}
          style={{ minWidth: 170 }}
          value={filters.statusIds}
        />

        <Select
          onChange={onDueFilterChange}
          options={[
            { label: t('filters.dueOptions.all'), value: 'all' },
            { label: t('filters.dueOptions.overdue'), value: 'overdue' },
            { label: t('filters.dueOptions.today'), value: 'today' },
            { label: t('filters.dueOptions.week'), value: 'week' },
            { label: t('filters.dueOptions.noDue'), value: 'no_due' },
          ]}
          placeholder={t('filters.due')}
          style={{ minWidth: 170 }}
          value={filters.due}
        />

        <Tooltip title={t('actions.clearFilters')}>
          <Button aria-label={t('actions.clearFilters')} icon={<ClearOutlined />} onClick={onClearFilters} />
        </Tooltip>
      </Flex>

      <Flex align="center" gap={10} style={{ flexWrap: 'wrap' }}>
        <Segmented
          onChange={(value) => onThemeModeChange(value as ThemeMode)}
          options={[
            { label: t('theme.mode.light'), value: 'light' },
            { label: t('theme.mode.dark'), value: 'dark' },
          ]}
          size="middle"
          value={themeMode}
        />

        <Space size={6}>
          <Typography.Text type="secondary">{t('theme.primary')}</Typography.Text>
          <ColorPicker
            onChangeComplete={(color) =>
              onThemeColorsChange({
                ...themeColors,
                primary: color.toHexString(),
              })
            }
            presets={[
              {
                label: t('theme.palette'),
                colors: THEME_COLOR_PRESETS,
              },
            ]}
            showText
            value={themeColors.primary}
          />
        </Space>

        <Space size={6}>
          <Typography.Text type="secondary">{t('theme.secondary')}</Typography.Text>
          <ColorPicker
            onChangeComplete={(color) =>
              onThemeColorsChange({
                ...themeColors,
                secondary: color.toHexString(),
              })
            }
            presets={[
              {
                label: t('theme.palette'),
                colors: THEME_COLOR_PRESETS,
              },
            ]}
            showText
            value={themeColors.secondary}
          />
        </Space>

        <Select
          onChange={onLanguageChange}
          options={[
            { label: t('language.en'), value: 'en' },
            { label: t('language.it'), value: 'it' },
          ]}
          style={{ width: 122 }}
          value={language}
        />

        <Space size={8}>
          <Tooltip title={t('actions.import')}>
            <Button aria-label={t('actions.import')} icon={<UploadOutlined />} onClick={onImport} />
          </Tooltip>
          <Tooltip title={t('actions.export')}>
            <Button aria-label={t('actions.export')} icon={<DownloadOutlined />} onClick={onExport} />
          </Tooltip>
          <Tooltip title={t('task.create')}>
            <Button aria-label={t('task.create')} icon={<PlusOutlined />} onClick={onCreateTask} type="primary" />
          </Tooltip>
        </Space>
      </Flex>
    </Flex>
  );
};
