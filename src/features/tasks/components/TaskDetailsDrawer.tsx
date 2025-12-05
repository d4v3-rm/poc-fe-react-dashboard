import { EditOutlined } from "@ant-design/icons";
import { Button, Card, Drawer, Flex, Tag, Typography, theme } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";
import {
  semanticTagStyle,
  statusTagStyle,
} from "../../../shared/theme/color-utils";
import { formatDueDate } from "../../../shared/utils/date";
import type { TaskItem, TaskStatus } from "../task.types";

type TaskDetailsDrawerProps = {
  open: boolean;
  task: TaskItem | null;
  statuses: TaskStatus[];
  language: "en" | "it";
  onClose: () => void;
  onEdit: (taskId: string) => void;
};

export const TaskDetailsDrawer = ({
  open,
  task,
  statuses,
  language,
  onClose,
  onEdit,
}: TaskDetailsDrawerProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const drawerMaskStyle = {
    backgroundColor: "rgba(12, 22, 38, 0.44)",
    backdropFilter: "blur(2px)",
  };

  if (!task) {
    return null;
  }

  const status =
    statuses.find((entry) => entry.id === task.statusId) ?? statuses[0];
  const statusChipStyle = status
    ? {
        ...statusTagStyle(status.color, token.colorBgContainer),
      }
    : undefined;
  const taskTagStyle = semanticTagStyle(
    token.colorPrimary,
    0.14,
    0.34,
    token.colorBgContainer,
  );

  return (
    <Drawer
      destroyOnHidden
      open={open}
      onClose={onClose}
      placement="right"
      size="large"
      title={t("task.preview")}
      width="min(560px, 94vw)"
      footer={
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={() => onEdit(task.id)}
        >
          {t("actions.edit")}
        </Button>
      }
      styles={{
        root: {
          margin: "10px 12px 12px 0",
        },
        mask: drawerMaskStyle,
        section: {
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          background: token.colorBgContainer,
          boxShadow: token.boxShadowSecondary,
          overflow: "hidden",
        },
        body: {
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG,
          padding: 0,
          overflow: "hidden",
        },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: "12px 16px",
          background: token.colorBgContainer,
        },
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          flexDirection: "column",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Flex vertical gap={4}>
            <Typography.Text type="secondary">
              {t("task.form.title")}
            </Typography.Text>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {task.title}
            </Typography.Title>
          </Flex>
        </div>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: 12,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Card size="small">
            <Flex gap={8} vertical>
              <Flex gap={8} wrap>
                <Tag bordered={false} style={statusChipStyle}>
                  {status?.name ?? "-"}
                </Tag>
                <Tag>{formatDueDate(task.dueDate, language)}</Tag>
              </Flex>
            </Flex>
          </Card>

          <Card size="small" style={{ minHeight: 0 }}>
            <Flex gap={8} vertical>
              <Typography.Text type="secondary">
                {t("task.form.tags")}
              </Typography.Text>
              <Flex gap={6} wrap>
                {task.tags.length === 0 ? (
                  <Typography.Text type="secondary">
                    {t("task.noTags")}
                  </Typography.Text>
                ) : (
                  task.tags.map((tag) => (
                    <Tag key={tag} style={taskTagStyle}>
                      {tag}
                    </Tag>
                  ))
                )}
              </Flex>
            </Flex>
          </Card>

          <Card size="small" style={{ minHeight: 0, flex: 1 }}>
            <Flex gap={8} vertical style={{ height: "100%" }}>
              <Typography.Text
                type="secondary"
                style={{ marginBottom: 8, display: "inline-block" }}
              >
                {t("task.form.content")}
              </Typography.Text>
              <div
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: "auto",
                  border: `1px solid ${token.colorBorderSecondary}`,
                  borderRadius: token.borderRadiusLG,
                  padding: 10,
                  background: token.colorBgElevated,
                }}
              >
                {task.content.trim().length > 0 ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {task.content}
                  </ReactMarkdown>
                ) : (
                  <Typography.Text type="secondary">
                    {t("task.form.markdownHint")}
                  </Typography.Text>
                )}
              </div>
            </Flex>
          </Card>
        </div>
      </div>
    </Drawer>
  );
};
