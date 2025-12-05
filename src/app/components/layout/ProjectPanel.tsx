import {
  AppstoreOutlined,
  FolderOpenOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Flex,
  Grid,
  Layout,
  Tooltip,
  Typography,
  theme,
} from "antd";
import type { ProjectItem } from "../../../features/projects/project.types";
import { ProjectSidebar } from "../../../features/projects/components/ProjectSidebar";
import { useTranslation } from "react-i18next";

type ProjectPanelProps = {
  isCompactLayout: boolean;
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
  projects: ProjectItem[];
  activeProjectId: string | null;
  onOpenThemeSettings: () => void;
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (project: ProjectItem) => void;
};

const COLLAPSED_PANEL_WIDTH = 64;
const COLLAPSED_PANEL_MARGIN = 8;

export const ProjectPanel = ({
  isCompactLayout,
  isCollapsed,
  onCollapseChange,
  projects,
  activeProjectId,
  onOpenThemeSettings,
  onCreateProject,
  onSelectProject,
  onEditProject,
  onDeleteProject,
}: ProjectPanelProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const drawerOpen = isCompactLayout && !isCollapsed;

  const projectIconList = (
    <Flex
      align="center"
      gap={6}
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        paddingBottom: 6,
      }}
      vertical
    >
      {projects.map((project) => (
        <Tooltip key={project.id} placement="right" title={project.name}>
          <Button
            aria-label={project.name}
            icon={<FolderOpenOutlined />}
            onClick={() => onSelectProject(project.id)}
            shape="circle"
            type={activeProjectId === project.id ? "primary" : "default"}
          />
        </Tooltip>
      ))}
    </Flex>
  );

  if (isCompactLayout) {
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

              {projectIconList}
            </Flex>
          </Flex>
        </Layout.Sider>

        <Drawer
          open={drawerOpen}
          onClose={() => onCollapseChange(true)}
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
                  if (!screens.lg) {
                    onCollapseChange(true);
                  }
                }}
                projects={projects}
                showHeader={false}
              />
            </div>
          </Flex>
        </Drawer>
      </>
    );
  }

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
            projectIconList
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
