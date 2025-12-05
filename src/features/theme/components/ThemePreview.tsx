import { Button, Divider, Flex, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import {
  getFallbackColor,
  textColorFor,
} from "../../../shared/theme/color-utils";
import type { ThemePreviewProps } from "./ThemeSidebarCard.types";

export const ThemePreview = ({ themeColors }: ThemePreviewProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <>
      <Divider style={{ margin: "2px 0" }} />

      <Flex gap={10} vertical>
        <Typography.Text
          style={{ color: token.colorTextSecondary, fontSize: 12 }}
        >
          {t("theme.preview")}
        </Typography.Text>
        <Flex align="center" gap={8}>
          <Button
            aria-label={`${t("theme.accent")}: ${getFallbackColor(themeColors.primary)}`}
            shape="circle"
            size="small"
            style={{
              backgroundColor: getFallbackColor(themeColors.primary),
              borderColor: token.colorBorder,
              color: textColorFor(themeColors.primary),
              height: 24,
              minWidth: 24,
              padding: 0,
              width: 24,
            }}
          />
          <Flex style={{ marginLeft: 6 }} vertical>
            <Typography.Text strong style={{ fontSize: 12 }}>
              {t("theme.previewName")}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              {t("theme.previewHint")}
            </Typography.Text>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
