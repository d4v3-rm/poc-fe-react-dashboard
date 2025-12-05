import {
  FolderOpenOutlined,
  LeftOutlined,
  PlusOutlined,
  RightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Flex, Layout, Tooltip } from "antd";
import type { ProjectItem } from "../../../features/projects/project.types";
import { ProjectSidebar } from "../../../features/projects/components/ProjectSidebar";
import { useTranslation } from "react-i18next";

type ProjectPanelProps = {
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

export const ProjectPanel = ({
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

  return (
    <Layout.Sider
      collapsed={isCollapsed}
      collapsedWidth={84}
      style={{
        background: "transparent",
        marginRight: 14,
      }}
      trigger={null}
      width={340}
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
            <Flex align="center" gap={8} vertical>
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
            <Flex
              align="center"
              gap={8}
              style={{
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
                paddingBottom: 8,
              }}
              vertical
            >
              {projects.map((project) => (
                <Tooltip
                  key={project.id}
                  placement="right"
                  title={project.name}
                >
                  <Button
                    aria-label={project.name}
                    icon={<FolderOpenOutlined />}
                    onClick={() => onSelectProject(project.id)}
                    shape="circle"
                    type={
                      activeProjectId === project.id ? "primary" : "default"
                    }
                  />
                </Tooltip>
              ))}
            </Flex>
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
