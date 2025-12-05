import {
  DeleteOutlined,
  EditOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { Button, Card, Dropdown, Empty, Flex, List, Space, Tag, theme, Tooltip, Typography } from 'antd';
import type { MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';
import type { ProjectItem } from '../project.types';

type ProjectSidebarProps = {
  projects: ProjectItem[];
  activeProjectId: string | null;
  showHeader?: boolean;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (project: ProjectItem) => void;
};

export const ProjectSidebar = ({
  projects,
  activeProjectId,
  showHeader = true,
  onSelectProject,
  onCreateProject,
  onEditProject,
  onDeleteProject,
}: ProjectSidebarProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  return (
    <Flex gap={16} vertical>
      {showHeader && (
        <Flex align="center" justify="space-between">
          <Typography.Title level={4} style={{ letterSpacing: '-0.015em', margin: 0 }}>
            {t('project.sectionTitle')}
          </Typography.Title>
          <Button icon={<FolderAddOutlined />} onClick={onCreateProject} type="primary">
            {t('project.create')}
          </Button>
        </Flex>
      )}

      {projects.length === 0 && (
        <Card>
          <Empty description={t('project.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      )}

      <List
        dataSource={projects}
        renderItem={(project) => {
          const menuItems: MenuProps['items'] = [
            {
              key: 'edit',
              icon: <EditOutlined />,
              label: t('actions.edit'),
            },
            {
              key: 'delete',
              icon: <DeleteOutlined />,
              danger: true,
              label: t('actions.delete'),
            },
          ];

          const isActive = activeProjectId === project.id;

          return (
            <List.Item style={{ border: 'none', paddingInline: 0, paddingTop: 0, paddingBottom: 10 }}>
              <Card
                hoverable
                key={project.id}
                onClick={() => onSelectProject(project.id)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectProject(project.id);
                  }
                }}
                role="button"
                size="small"
                style={{
                  borderColor: isActive ? token.colorPrimary : token.colorBorderSecondary,
                  borderWidth: isActive ? 2 : 1,
                  borderStyle: 'solid',
                  width: '100%',
                }}
                tabIndex={0}
              >
                <Flex align="center" justify="space-between" style={{ marginBottom: 8 }}>
                  <Space size={8}>
                    <FolderOpenOutlined />
                    <Typography.Text ellipsis strong style={{ maxWidth: 180 }}>
                      {project.name}
                    </Typography.Text>
                  </Space>
                  <Tag>{project.tasks.length}</Tag>
                </Flex>

                <Flex align="start" justify="space-between">
                  <Typography.Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{ marginBottom: 0, maxWidth: 190 }}
                    type="secondary"
                  >
                    {project.description || '-'}
                  </Typography.Paragraph>

                  <Dropdown
                    menu={{
                      items: menuItems,
                      onClick: ({ key, domEvent }) => {
                        domEvent.stopPropagation();

                        if (key === 'edit') {
                          onEditProject(project);
                          return;
                        }

                        onDeleteProject(project);
                      },
                    }}
                    trigger={['click']}
                  >
                    <Tooltip title={t('actions.more')}>
                      <Button
                        icon={<MoreOutlined />}
                        onClick={(event) => event.stopPropagation()}
                        shape="circle"
                        type="text"
                      />
                    </Tooltip>
                  </Dropdown>
                </Flex>
              </Card>
            </List.Item>
          );
        }}
      />
    </Flex>
  );
};
