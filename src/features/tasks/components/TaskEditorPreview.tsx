import { Card, Flex, Tag, Typography, theme } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";
import {
  semanticTagStyle,
  statusTagStyle,
} from "../../../shared/theme/color-utils";
import type { TaskEditorPreviewProps } from "./TaskEditorDrawer.types";

export const TaskEditorPreview = ({
  content,
  previewTags,
  previewStatus,
  previewDueDate,
}: TaskEditorPreviewProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const statusPreviewStyle = previewStatus
    ? statusTagStyle(previewStatus.color, token.colorBgContainer)
    : undefined;
  const taskTagStyle = semanticTagStyle(
    token.colorPrimary,
    0.14,
    0.34,
    token.colorBgContainer,
  );

  return (
    <Card size="small" style={{ height: "100%", overflow: "hidden" }}>
      <Flex gap={8} vertical>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {t("task.preview")}
        </Typography.Title>
        <Flex gap={6} wrap>
          <Tag bordered={false} style={statusPreviewStyle}>
            {previewStatus?.name ?? t("task.form.status")}
          </Tag>
          <Tag bordered={false}>
            {previewDueDate.length > 0
              ? previewDueDate
              : t("task.form.dueDate")}
          </Tag>
        </Flex>

        <Flex gap={6} wrap>
          {previewTags.length === 0 ? (
            <Typography.Text type="secondary">
              {t("task.noTags")}
            </Typography.Text>
          ) : (
            previewTags.map((tag) => (
              <Tag key={tag} style={taskTagStyle}>
                {tag}
              </Tag>
            ))
          )}
        </Flex>

        <div
          style={{
            flex: 1,
            minHeight: 0,
            border: `1px solid ${token.colorBorderSecondary}`,
            borderRadius: token.borderRadiusLG,
            padding: 12,
            overflow: "auto",
          }}
        >
          {content.trim().length > 0 ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          ) : (
            <Typography.Text type="secondary">
              {t("task.form.markdownHint")}
            </Typography.Text>
          )}
        </div>
      </Flex>
    </Card>
  );
};
