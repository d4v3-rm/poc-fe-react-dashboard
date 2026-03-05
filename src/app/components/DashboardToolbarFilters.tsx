import {
  AppstoreOutlined,
  ClearOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Flex, Input, Segmented, Select, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import type { ViewMode } from "../../app/dashboard.types";
import type { DashboardToolbarFiltersProps } from "./DashboardToolbar.types";

export const DashboardToolbarFilters = ({
  viewMode,
  filters,
  statuses,
  availableTags,
  onViewModeChange,
  onSearchChange,
  onStatusFilterChange,
  onTagFilterChange,
  onDueFilterChange,
  onClearFilters,
}: DashboardToolbarFiltersProps) => {
  const { t } = useTranslation();

  return (
    <Flex
      align="center"
      gap={10}
      style={{ flex: 1, flexWrap: "wrap", minWidth: 0 }}
    >
      <Segmented
        onChange={(value) => onViewModeChange(value as ViewMode)}
        options={[
          {
            label: (
              <Tooltip title={t("view.list")}>
                <UnorderedListOutlined />
              </Tooltip>
            ),
            value: "list",
          },
          {
            label: (
              <Tooltip title={t("view.kanban")}>
                <AppstoreOutlined />
              </Tooltip>
            ),
            value: "kanban",
          },
        ]}
        value={viewMode}
      />

      <Input
        allowClear
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={t("filters.search")}
        style={{ flex: "1 1 220px", minWidth: 0, width: "auto" }}
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
        placeholder={t("filters.status")}
        style={{ flex: "1 1 170px", minWidth: 140 }}
        value={filters.statusIds}
      />

      <Select
        allowClear
        disabled={availableTags.length === 0}
        mode="multiple"
        onChange={onTagFilterChange}
        options={availableTags.map((tag) => ({
          label: tag,
          value: tag,
        }))}
        placeholder={t("filters.tag")}
        style={{ flex: "1 1 180px", minWidth: 140 }}
        value={filters.tagIds}
      />

      <Select
        onChange={onDueFilterChange}
        options={[
          { label: t("filters.dueOptions.all"), value: "all" },
          { label: t("filters.dueOptions.overdue"), value: "overdue" },
          { label: t("filters.dueOptions.today"), value: "today" },
          { label: t("filters.dueOptions.week"), value: "week" },
          { label: t("filters.dueOptions.noDue"), value: "no_due" },
        ]}
        placeholder={t("filters.due")}
        style={{ flex: "1 1 170px", minWidth: 140 }}
        value={filters.due}
      />

      <Tooltip title={t("actions.clearFilters")}>
        <Button
          aria-label={t("actions.clearFilters")}
          icon={<ClearOutlined />}
          onClick={onClearFilters}
        />
      </Tooltip>
    </Flex>
  );
};
