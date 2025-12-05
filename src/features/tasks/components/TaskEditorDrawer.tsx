import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Col, DatePicker, Drawer, Flex, Form, Grid, Input, Row, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { taskFormSchema, type TaskFormValues } from '../task.schema';
import type { TaskItem, TaskStatus } from '../task.types';

type TaskEditorDrawerProps = {
  open: boolean;
  mode: 'create' | 'edit';
  statuses: TaskStatus[];
  initialTask?: TaskItem | null;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    content: string;
    statusId: string;
    dueDate: string | null;
  }) => void;
};

export const TaskEditorDrawer = ({
  open,
  mode,
  statuses,
  initialTask,
  onClose,
  onSubmit,
}: TaskEditorDrawerProps) => {
  const { t } = useTranslation();
  const screens = Grid.useBreakpoint();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      content: '',
      statusId: statuses[0]?.id ?? '',
      dueDate: null,
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      title: initialTask?.title ?? '',
      content: initialTask?.content ?? '',
      statusId: initialTask?.statusId ?? statuses[0]?.id ?? '',
      dueDate: initialTask?.dueDate ? dayjs(initialTask.dueDate) : null,
    });
  }, [initialTask?.content, initialTask?.dueDate, initialTask?.statusId, initialTask?.title, open, reset, statuses]);

  const content = useWatch({
    control,
    name: 'content',
  });

  return (
    <Drawer
      destroyOnHidden
      footer={
        <Flex justify="end">
          <Space>
            <Button onClick={onClose}>{t('actions.cancel')}</Button>
            <Button
              loading={isSubmitting}
              onClick={handleSubmit((values) => {
                onSubmit({
                  title: values.title,
                  content: values.content,
                  statusId: values.statusId,
                  dueDate: values.dueDate ? values.dueDate.toISOString() : null,
                });
              })}
              type="primary"
            >
              {mode === 'create' ? t('actions.create') : t('actions.save')}
            </Button>
          </Space>
        </Flex>
      }
      onClose={onClose}
      open={open}
      placement="right"
      size="large"
      title={mode === 'create' ? t('task.create') : t('task.edit')}
    >
      <Row gutter={18}>
        <Col span={screens.lg ? 12 : 24}>
          <Form layout="vertical">
            <Form.Item
              help={errors.title?.message}
              label={t('task.form.title')}
              validateStatus={errors.title ? 'error' : ''}
            >
              <Controller
                control={control}
                name="title"
                render={({ field }) => <Input {...field} autoFocus placeholder={t('task.form.title')} />}
              />
            </Form.Item>

            <Row gutter={12}>
              <Col span={screens.sm ? 12 : 24}>
                <Form.Item
                  help={errors.statusId?.message}
                  label={t('task.form.status')}
                  validateStatus={errors.statusId ? 'error' : ''}
                >
                  <Controller
                    control={control}
                    name="statusId"
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={statuses.map((status) => ({
                          label: status.name,
                          value: status.id,
                        }))}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col span={screens.sm ? 12 : 24}>
                <Form.Item
                  help={errors.dueDate?.message as string | undefined}
                  label={t('task.form.dueDate')}
                  validateStatus={errors.dueDate ? 'error' : ''}
                >
                  <Controller
                    control={control}
                    name="dueDate"
                    render={({ field }) => (
                      <DatePicker
                        allowClear
                        format="YYYY-MM-DD"
                        onChange={(value) => field.onChange(value ?? null)}
                        style={{ width: '100%' }}
                        value={field.value}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              help={errors.content?.message}
              label={
                <Space direction="vertical" size={0}>
                  <span>{t('task.form.content')}</span>
                  <Typography.Text type="secondary">{t('task.form.markdownHint')}</Typography.Text>
                </Space>
              }
              validateStatus={errors.content ? 'error' : ''}
            >
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <Input.TextArea {...field} autoSize={{ minRows: 12, maxRows: 18 }} />
                )}
              />
            </Form.Item>
          </Form>
        </Col>

        <Col span={screens.lg ? 12 : 24}>
          <Card>
            <Flex gap={10} vertical>
              <Typography.Title level={5} style={{ margin: 0 }}>
                {t('task.preview')}
              </Typography.Title>
              <Card size="small" style={{ maxHeight: screens.lg ? 560 : 300, minHeight: 220, overflow: 'auto' }}>
                {(content ?? '').trim().length > 0 ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{content ?? ''}</ReactMarkdown>
                ) : (
                  <Typography.Text type="secondary">{t('task.form.markdownHint')}</Typography.Text>
                )}
              </Card>
            </Flex>
          </Card>
        </Col>
      </Row>
    </Drawer>
  );
};
