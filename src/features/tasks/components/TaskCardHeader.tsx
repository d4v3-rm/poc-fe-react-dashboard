import { FlagOutlined, HolderOutlined, SwapOutlined } from "@ant-design/icons";
import { Button, Dropdown, Space, Tag, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { statusTagStyle } from "../../../shared/theme/color-utils";
import type { TaskCardHeaderProps } from "./TaskCard.types";

export const TaskCardHeader = ({
  task,
  status,
  statuses,
  showDragHandle = false,
  dragHandleProps,
  onStatusChange,
}: TaskCardHeaderProps) => {
  const { t } = useTranslation();
  const statusOptions: MenuProps["items"] = statuses
    .filter((option) => option.id !== task.statusId)
    .map((option) => ({
      key: option.id,
      label: option.name,
      icon: <FlagOutlined style={{ color: option.color }} />,
    }));

  return (
    <>
      <Tag style={statusTagStyle(status.color)}>{status.name}</Tag>

      <Space size={4} align="center">
        {showDragHandle && dragHandleProps ? (
          <Tooltip title={t("task.drag")}>
            <Button
              aria-label={t("task.drag")}
              icon={<HolderOutlined />}
              ref={(element) => dragHandleProps.setActivatorNodeRef?.(element)}
              size="small"
              type="text"
              {...dragHandleProps.attributes}
              {...dragHandleProps.listeners}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            />
          </Tooltip>
        ) : null}

        {statusOptions.length > 0 && (
          <Dropdown
            menu={{
              items: statusOptions,
              onClick: ({ key }) => {
                onStatusChange(task.id, String(key));
              },
            }}
            trigger={["click"]}
          >
            <Tooltip title={t("task.quickStatus")}>
              <Button
                aria-label={t("task.quickStatus")}
                icon={<SwapOutlined />}
                size="small"
                type="text"
                onClick={(event) => event.stopPropagation()}
              />
            </Tooltip>
          </Dropdown>
        )}
      </Space>
    </>
  );
};
