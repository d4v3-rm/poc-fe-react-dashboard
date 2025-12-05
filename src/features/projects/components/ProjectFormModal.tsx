import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { projectFormSchema, type ProjectFormValues } from '../project.schema';

type ProjectFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: Partial<ProjectFormValues>;
  onCancel: () => void;
  onSubmit: (values: ProjectFormValues) => void;
};

const defaultValues: ProjectFormValues = {
  name: '',
  description: '',
};

export const ProjectFormModal = ({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: ProjectFormModalProps) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
    });
  }, [initialValues?.description, initialValues?.name, open, reset]);

  return (
    <Modal
      destroyOnHidden
      open={open}
      onCancel={onCancel}
      title={mode === 'create' ? t('project.create') : t('project.edit')}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {t('actions.cancel')}
        </Button>,
        <Button
          key="save"
          loading={isSubmitting}
          type="primary"
          onClick={handleSubmit((values) => onSubmit(values))}
        >
          {mode === 'create' ? t('actions.create') : t('actions.save')}
        </Button>,
      ]}
    >
      <Form layout="vertical" onFinish={handleSubmit((values) => onSubmit(values))}>
        <Form.Item
          label={t('project.form.name')}
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => <Input {...field} autoFocus placeholder={t('project.form.name')} />}
          />
        </Form.Item>

        <Form.Item
          label={t('project.form.description')}
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
        >
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Input.TextArea
                {...field}
                autoSize={{ minRows: 3, maxRows: 6 }}
                placeholder={t('project.form.description')}
              />
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
