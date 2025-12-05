import { Flex, Typography } from "antd";
import type { DashboardWorkspaceHeaderProps } from "./DashboardWorkspace.types";

export const DashboardWorkspaceHeader = ({
  projectName,
  projectDescription,
}: DashboardWorkspaceHeaderProps) => (
  <Flex gap={2} vertical>
    <Typography.Title level={4} style={{ margin: 0 }}>
      {projectName}
    </Typography.Title>
    <Typography.Text type="secondary">{projectDescription}</Typography.Text>
  </Flex>
);
