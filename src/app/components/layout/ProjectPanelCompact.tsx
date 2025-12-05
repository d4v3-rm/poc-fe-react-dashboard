import {
  AppstoreOutlined,
  LeftOutlined,
  PlusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Flex, Layout, Tooltip, Typography, theme } from "antd";
import { useTranslation } from "react-i18next";
import { ProjectSidebar } from "../../../features/projects/components/ProjectSidebar";
import { ProjectPanelIconList } from "./ProjectPanelIconList";
import type { ProjectPanelBaseProps } from "./ProjectPanel.types";

const COLLAPSED_PANEL_WIDTH = 64;
const COLLAPSED_PANEL_MARGIN = 8;

export const ProjectPanelCompact = ({
  isCollapsed,
  onCollapseChange,
  projects,
  activeProjectId,
  onOpenThemeSettings,
  onCreateProject,
  onSelectProject,
  onEditProject,
  onDeleteProject,
}: ProjectPanelBaseProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const drawerOpen = !isCollapsed;

  return (
    <>
      <Layout.Sider
        collapsed
        collapsedWidth={COLLAPSED_PANEL_WIDTH}
        style={{
          background: "transparent",
          marginRight: COLLAPSED_PANEL_MARGIN,
        }}
        trigger={null}
        width={COLLAPSED_PANEL_WIDTH}
      >
        <Flex style={{ height: "100%" }} vertical>
          <Flex gap={6} style={{ flex: 1, minHeight: 0 }} vertical>
            <Flex align="center" gap={6} vertical>
              <Tooltip title={t("theme.openSettings")}>
                <Button
                  aria-label={t("theme.openSettings")}
                  icon={<SettingOutlined />}
                  onClick={onOpenThemeSettings}
                  shape="circle"
                  type="text"
                />
              </Tooltip>

              <Tooltip title={t("project.create")}>
                <Button
                  aria-label={t("project.create")}
                  icon={<PlusOutlined />}
                  onClick={onCreateProject}
                  shape="circle"
                  type="text"
                />
              </Tooltip>

              <Tooltip title={t("project.expandPanel")}>
                <Button
                  aria-label={t("project.expandPanel")}
                  icon={<AppstoreOutlined />}
                  onClick={() => onCollapseChange(false)}
                  shape="circle"
                  type="text"
                />
              </Tooltip>
            </Flex>

            <ProjectPanelIconList
              activeProjectId={activeProjectId}
              onSelectProject={onSelectProject}
              projects={projects}
            />
          </Flex>
        </Flex>
      </Layout.Sider>

      <Drawer
        onClose={() => onCollapseChange(true)}
        open={drawerOpen}
        placement="left"
        title={t("project.sectionTitle")}
        width="min(320px, calc(100vw - 24px))"
        styles={{
          body: {
            padding: 16,
          },
          header: {
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          },
        }}
      >
        <Flex gap={12} style={{ height: "100%" }} vertical>
          <Flex align="center" gap={8} justify="space-between">
            <Typography.Text strong>
              {t("project.sectionTitle")}
            </Typography.Text>
            <Flex gap={8}>
              <Tooltip title={t("theme.openSettings")}>
                <Button
                  aria-label={t("theme.openSettings")}
                  icon={<SettingOutlined />}
                  onClick={onOpenThemeSettings}
                  type="text"
                />
              </Tooltip>
              <Tooltip title={t("project.create")}>
                <Button
                  aria-label={t("project.create")}
                  icon={<PlusOutlined />}
                  onClick={onCreateProject}
                  type="primary"
                />
              </Tooltip>
              <Tooltip title={t("project.collapsePanel")}>
                <Button
                  aria-label={t("project.collapsePanel")}
                  icon={<LeftOutlined />}
                  onClick={() => onCollapseChange(true)}
                  type="text"
                />
              </Tooltip>
            </Flex>
          </Flex>

          <div style={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
            <ProjectSidebar
              activeProjectId={activeProjectId}
              onCreateProject={onCreateProject}
              onDeleteProject={onDeleteProject}
              onEditProject={onEditProject}
              onSelectProject={(projectId) => {
                onSelectProject(projectId);
                onCollapseChange(true);
              }}
              projects={projects}
              showHeader={false}
            />
          </div>
        </Flex>
      </Drawer>
    </>
  );
};
