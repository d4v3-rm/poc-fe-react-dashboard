import { Flex } from "antd";
import { DashboardToolbarActions } from "./DashboardToolbarActions";
import { DashboardToolbarFilters } from "./DashboardToolbarFilters";
import type { DashboardToolbarProps } from "./DashboardToolbar.types";

export const DashboardToolbar = ({
  viewMode,
  filters,
  statuses,
  availableTags,
  language,
  onViewModeChange,
  onSearchChange,
  onStatusFilterChange,
  onTagFilterChange,
  onDueFilterChange,
  onClearFilters,
  onLanguageChange,
  onCreateTask,
  onAddStatus,
  statusActionsDisabled = false,
  onImport,
  onExport,
}: DashboardToolbarProps) => {
  return (
    <Flex
      align="center"
      gap={12}
      justify="space-between"
      style={{ flexWrap: "wrap" }}
    >
      <Flex
        align="center"
        gap={10}
        style={{ flex: 1, flexWrap: "wrap", minWidth: 0 }}
      >
        <DashboardToolbarFilters
          availableTags={availableTags}
          filters={filters}
          onClearFilters={onClearFilters}
          onDueFilterChange={onDueFilterChange}
          onSearchChange={onSearchChange}
          onStatusFilterChange={onStatusFilterChange}
          onTagFilterChange={onTagFilterChange}
          onViewModeChange={onViewModeChange}
          statuses={statuses}
          viewMode={viewMode}
        />
      </Flex>

      <DashboardToolbarActions
        language={language}
        onAddStatus={onAddStatus}
        onCreateTask={onCreateTask}
        onExport={onExport}
        onImport={onImport}
        onLanguageChange={onLanguageChange}
        statusActionsDisabled={statusActionsDisabled}
        viewMode={viewMode}
      />
    </Flex>
  );
};
