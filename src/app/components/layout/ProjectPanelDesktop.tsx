import {
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Flex, Layout, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { ProjectSidebar } from "../../../features/projects/components/ProjectSidebar";
import { ProjectPanelIconList } from "./ProjectPanelIconList";
import type { ProjectPanelBaseProps } from "./ProjectPanel.types";

const COLLAPSED_PANEL_WIDTH = 64;
const COLLAPSED_PANEL_MARGIN = 8;

export const ProjectPanelDesktop = ({
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

  return (
    <Layout.Sider
      collapsed={isCollapsed}
      collapsedWidth={COLLAPSED_PANEL_WIDTH}
      style={{
        background: "transparent",
        marginRight: isCollapsed ? COLLAPSED_PANEL_MARGIN : 14,
      }}
      trigger={null}
      width={320}
    >
      <Flex style={{ height: "100%" }} vertical>
        <Flex gap={12} style={{ flex: 1, minHeight: 0 }} vertical>
          {!isCollapsed && (
            <Flex align="center" gap={10} justify="space-between">
              <Flex align="center" gap={8}>
                <Tooltip title={t("theme.openSettings")}>
                  <Button
                    aria-label={t("theme.openSettings")}
                    icon={<SettingOutlined />}
                    onClick={onOpenThemeSettings}
                    type="text"
                  />
                </Tooltip>

                <h4 style={{ margin: 0 }}>{t("project.sectionTitle")}</h4>
              </Flex>

              <Flex gap={8}>
                <Tooltip title={t("project.create")}>
                  <Button
                    aria-label={t("project.create")}
                    icon={<PlusOutlined />}
                    onClick={onCreateProject}
                    size="small"
                    type="primary"
                  />
                </Tooltip>

                <Tooltip title={t("project.collapsePanel")}>
                  <Button
                    aria-label={t("project.collapsePanel")}
                    icon={<LeftOutlined />}
                    onClick={() => onCollapseChange(true)}
                    size="small"
                    type="text"
                  />
                </Tooltip>
              </Flex>
            </Flex>
          )}

          {isCollapsed && (
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
                  icon={<RightOutlined />}
                  onClick={() => onCollapseChange(false)}
                  shape="circle"
                  type="text"
                />
              </Tooltip>
            </Flex>
          )}

          {isCollapsed ? (
            <ProjectPanelIconList
              activeProjectId={activeProjectId}
              onSelectProject={onSelectProject}
              projects={projects}
            />
          ) : (
            <div
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                paddingRight: 2,
              }}
            >
              <ProjectSidebar
                activeProjectId={activeProjectId}
                onCreateProject={onCreateProject}
                onDeleteProject={onDeleteProject}
                onEditProject={onEditProject}
                onSelectProject={onSelectProject}
                projects={projects}
                showHeader={false}
              />
            </div>
          )}
        </Flex>
      </Flex>
    </Layout.Sider>
  );
};
