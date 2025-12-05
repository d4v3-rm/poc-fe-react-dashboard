import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Segmented, Select, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import type { TaskStatus, ViewMode } from '../../features/tasks/task.types';
import type { TaskFilters } from '../../store/dashboard-store.types';

type DashboardToolbarProps = {
  viewMode: ViewMode;
  filters: TaskFilters;
  statuses: TaskStatus[];
  language: 'en' | 'it';
  onViewModeChange: (mode: ViewMode) => void;
  onSearchChange: (query: string) => void;
  onStatusFilterChange: (statusIds: string[]) => void;
  onDueFilterChange: (due: TaskFilters['due']) => void;
  onClearFilters: () => void;
  onLanguageChange: (language: 'en' | 'it') => void;
  onCreateTask: () => void;
  onImport: () => void;
  onExport: () => void;
};

export const DashboardToolbar = ({
  viewMode,
  filters,
  statuses,
  language,
  onViewModeChange,
  onSearchChange,
  onStatusFilterChange,
  onDueFilterChange,
  onClearFilters,
  onLanguageChange,
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

        <Button onClick={onClearFilters}>{t('actions.clearFilters')}</Button>
      </Flex>

      <Flex align="center" gap={10} style={{ flexWrap: 'wrap' }}>
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
          <Button icon={<UploadOutlined />} onClick={onImport}>
            {t('actions.import')}
          </Button>
          <Button icon={<DownloadOutlined />} onClick={onExport}>
            {t('actions.export')}
          </Button>
          <Button icon={<PlusOutlined />} onClick={onCreateTask} type="primary">
            {t('task.create')}
          </Button>
        </Space>
      </Flex>
    </Flex>
  );
};
