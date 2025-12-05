import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Flex, Tag, Tooltip, Typography, theme } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { statusTagStyle } from "../../../shared/theme/color-utils";
import type { KanbanColumnHeaderProps } from "./KanbanColumn.types";

export const KanbanColumnHeader = ({
  status,
  taskCount,
  canDeleteStatus,
  onEditStatus,
  onDeleteStatus,
}: KanbanColumnHeaderProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const actions: MenuProps["items"] = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: t("actions.edit"),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      danger: true,
      disabled: !canDeleteStatus,
      label: t("actions.delete"),
    },
  ];

  return (
    <Flex align="center" gap={8} justify="space-between">
      <Flex align="center" gap={8}>
        <Tag style={statusTagStyle(status.color, token.colorBgContainer)}>
          {status.name}
        </Tag>
        <Typography.Text type="secondary">{taskCount}</Typography.Text>
      </Flex>

      <Dropdown
        menu={{
          items: actions,
          onClick: ({ key }) => {
            if (key === "edit") {
              onEditStatus(status);
              return;
            }

            if (canDeleteStatus) {
              onDeleteStatus(status);
            }
          },
        }}
        trigger={["click"]}
      >
        <Tooltip title={t("actions.more")}>
          <Button
            aria-label={t("actions.more")}
            icon={<MoreOutlined />}
            size="small"
            type="text"
          />
        </Tooltip>
      </Dropdown>
    </Flex>
  );
};
