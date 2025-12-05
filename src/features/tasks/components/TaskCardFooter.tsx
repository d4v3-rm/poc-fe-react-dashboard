import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FlagOutlined,
} from "@ant-design/icons";
import { Button, Popconfirm, Space, Tag, Tooltip, theme } from "antd";
import { useTranslation } from "react-i18next";
import { semanticTagStyle } from "../../../shared/theme/color-utils";
import { formatDueDate, isOverdue } from "../../../shared/utils/date";
import type { TaskCardFooterProps } from "./TaskCard.types";

export const TaskCardFooter = ({
  task,
  language,
  showActions = true,
  onEdit,
  onDelete,
}: TaskCardFooterProps) => {
  const { token } = theme.useToken();
  const { t } = useTranslation();
  const dueIsOverdue = isOverdue(task.dueDate);
  const dueTagColor = dueIsOverdue ? token.colorError : token.colorInfo;
  const dueTagStyle = semanticTagStyle(
    dueTagColor,
    0.18,
    0.42,
    token.colorBgContainer,
  );

  return (
    <>
      <Tag
        icon={dueIsOverdue ? <FlagOutlined /> : undefined}
        style={dueTagStyle}
      >
        {formatDueDate(task.dueDate, language)}
      </Tag>

      {showActions && (
        <Space size={6}>
          <Tooltip title={t("actions.edit")}>
            <Button
              aria-label={t("actions.edit")}
              icon={<EditOutlined />}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(task.id);
              }}
              size="small"
            />
          </Tooltip>

          <Popconfirm
            description={t("task.deleteConfirm.description")}
            cancelButtonProps={{
              "aria-label": t("actions.cancel"),
              icon: <CloseOutlined />,
            }}
            okButtonProps={{
              "aria-label": t("actions.delete"),
              icon: <DeleteOutlined />,
            }}
            okText={t("actions.delete")}
            okType="danger"
            onConfirm={() => onDelete(task.id)}
            title={t("task.deleteConfirm.title")}
            cancelText={t("actions.cancel")}
          >
            <Tooltip title={t("actions.delete")}>
              <Button
                aria-label={t("actions.delete")}
                danger
                icon={<DeleteOutlined />}
                size="small"
                onClick={(event) => event.stopPropagation()}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )}
    </>
  );
};
