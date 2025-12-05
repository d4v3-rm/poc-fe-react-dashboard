import { FolderOpenOutlined } from "@ant-design/icons";
import { Button, Flex, Tooltip } from "antd";
import type { ProjectIconListProps } from "./ProjectPanel.types";

export const ProjectPanelIconList = ({
  projects,
  activeProjectId,
  onSelectProject,
}: ProjectIconListProps) => (
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
