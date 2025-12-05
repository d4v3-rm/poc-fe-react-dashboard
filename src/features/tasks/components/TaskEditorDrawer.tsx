import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DatePicker, Drawer, Form, Input, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { taskFormSchema, type TaskFormValues } from '../task.schema';
import type { TaskItem, TaskStatus } from '../task.types';
import './TaskEditorDrawer.css';

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
        <div className="task-editor__footer">
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
        </div>
      }
      onClose={onClose}
      open={open}
      placement="right"
      size="large"
      title={mode === 'create' ? t('task.create') : t('task.edit')}
    >
      <div className="task-editor">
        <Form className="task-editor__form" layout="vertical">
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

          <div className="task-editor__grid">
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
                    className="task-editor__date"
                    format="YYYY-MM-DD"
                    onChange={(value) => field.onChange(value ?? null)}
                    value={field.value}
                  />
                )}
              />
            </Form.Item>
          </div>

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

        <section className="task-editor__preview-wrap">
          <Typography.Title className="task-editor__preview-title" level={5}>
            {t('task.preview')}
          </Typography.Title>
          <div className="task-editor__preview markdown-surface">
            {(content ?? '').trim().length > 0 ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content ?? ''}</ReactMarkdown>
            ) : (
              <Typography.Text type="secondary">{t('task.form.markdownHint')}</Typography.Text>
            )}
          </div>
        </section>
      </div>
    </Drawer>
  );
};
