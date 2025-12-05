import { EditOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  Row,
  Tag,
  Typography,
  theme,
} from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";
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

  if (!task) {
    return null;
  }

  const status =
    statuses.find((entry) => entry.id === task.statusId) ?? statuses[0];

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
        wrapper: {
          border: `1px solid ${token.colorBorderSecondary}`,
          borderRadius: token.borderRadiusLG,
          background: token.colorBgElevated,
          boxShadow: token.boxShadowSecondary,
          overflow: "hidden",
        },
        body: {
          background: token.colorBgElevated,
          borderRadius: token.borderRadiusLG,
          padding: 12,
          overflow: "auto",
        },
        footer: {
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          padding: "12px 16px",
          background: token.colorBgElevated,
        },
      }}
    >
      <Flex gap={12} vertical>
        <Row gutter={12}>
          <Col span={24}>
            <Card>
              <Flex gap={8} vertical>
                <Flex align="center" gap={8} justify="space-between">
                  <Typography.Text strong>
                    {status?.name ?? "-"}
                  </Typography.Text>
                  <Tag>{formatDueDate(task.dueDate, language)}</Tag>
                </Flex>

                <Typography.Title level={4} style={{ margin: 0 }}>
                  {task.title}
                </Typography.Title>
              </Flex>
            </Card>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={24}>
            <Card>
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
                    task.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
                  )}
                </Flex>
              </Flex>
            </Card>
          </Col>
        </Row>

        <Card>
          <Typography.Text
            type="secondary"
            style={{ marginBottom: 8, display: "inline-block" }}
          >
            {t("task.form.content")}
          </Typography.Text>
          <Card size="small" style={{ minHeight: 200, overflow: "auto" }}>
            {task.content.trim().length > 0 ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {task.content}
              </ReactMarkdown>
            ) : (
              <Typography.Text type="secondary">
                {t("task.form.markdownHint")}
              </Typography.Text>
            )}
          </Card>
        </Card>
      </Flex>
    </Drawer>
  );
};
