import {
  DeleteOutlined,
  EditOutlined,
  FolderAddOutlined,
  FolderOpenOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Empty, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import type { ProjectItem } from '../project.types';
import './ProjectSidebar.css';

type ProjectSidebarProps = {
  projects: ProjectItem[];
  activeProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
  onEditProject: (project: ProjectItem) => void;
  onDeleteProject: (project: ProjectItem) => void;
};

export const ProjectSidebar = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  onEditProject,
  onDeleteProject,
}: ProjectSidebarProps) => {
  const { t } = useTranslation();

  return (
    <aside className="project-sidebar">
      <div className="project-sidebar__header">
        <div>
          <Typography.Title className="project-sidebar__title" level={4}>
            {t('project.sectionTitle')}
          </Typography.Title>
        </div>
        <Button icon={<FolderAddOutlined />} onClick={onCreateProject} type="primary">
          {t('project.create')}
        </Button>
      </div>

      {projects.length === 0 && (
        <div className="project-sidebar__empty-wrap">
          <Empty description={t('project.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}

      <div className="project-sidebar__list">
        {projects.map((project) => {
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

          return (
            <div
              key={project.id}
              className={clsx('project-sidebar__item', {
                'project-sidebar__item--active': activeProjectId === project.id,
              })}
              onClick={() => onSelectProject(project.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectProject(project.id);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="project-sidebar__item-main">
                <Space size={8}>
                  <FolderOpenOutlined />
                  <Typography.Text className="project-sidebar__item-title" strong>
                    {project.name}
                  </Typography.Text>
                </Space>
                <Tag>{project.tasks.length}</Tag>
              </div>

              <div className="project-sidebar__item-footer">
                <Typography.Text className="project-sidebar__item-description" type="secondary">
                  {project.description || '-'}
                </Typography.Text>

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
                  <Button
                    icon={<MoreOutlined />}
                    onClick={(event) => event.stopPropagation()}
                    shape="circle"
                    type="text"
                  />
                </Dropdown>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
