import {
  AppstoreAddOutlined,
  AppstoreOutlined,
  ClearOutlined,
  DownloadOutlined,
  GlobalOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Flex, Input, Segmented, Select, Space, Tooltip } from 'antd';
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
  onAddStatus: () => void;
  statusActionsDisabled?: boolean;
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
  onAddStatus,
  statusActionsDisabled = false,
  onImport,
  onExport,
}: DashboardToolbarProps) => {
  const { t } = useTranslation();

  return (
    <Flex align="center" gap={12} justify="space-between" style={{ flexWrap: 'wrap' }}>
      <Flex align="center" gap={10} style={{ flex: 1, flexWrap: 'wrap', minWidth: 0 }}>
        <Segmented
          onChange={(value) => onViewModeChange(value as ViewMode)}
          options={[
            {
              label: (
                <Tooltip title={t('view.list')}>
                  <UnorderedListOutlined />
                </Tooltip>
              ),
              value: 'list',
            },
            {
              label: (
                <Tooltip title={t('view.kanban')}>
                  <AppstoreOutlined />
                </Tooltip>
              ),
              value: 'kanban',
            },
          ]}
          value={viewMode}
        />

        <Input
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

      <Space size={8}>
        <Tooltip title={`${t('actions.toggleLanguage')} (${t(`language.${language}`)})`}>
          <Button
            aria-label={t('actions.toggleLanguage')}
            icon={<GlobalOutlined />}
            onClick={() => onLanguageChange(language === 'en' ? 'it' : 'en')}
          />
        </Tooltip>

        {viewMode === 'kanban' && (
          <Tooltip title={t('kanban.addStatus')}>
            <Button
              aria-label={t('kanban.addStatus')}
              disabled={statusActionsDisabled}
              icon={<AppstoreAddOutlined />}
              onClick={onAddStatus}
            />
          </Tooltip>
        )}

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
  );
};
