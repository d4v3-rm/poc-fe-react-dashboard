import { zodResolver } from '@hookform/resolvers/zod';
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Tooltip } from 'antd';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { DEFAULT_THEME_COLORS } from '../../../shared/utils/defaults';
import { statusFormSchema, type StatusFormValues } from '../status.schema';

type StatusFormModalProps = {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: Partial<StatusFormValues>;
  onCancel: () => void;
  onSubmit: (values: StatusFormValues) => void;
};

const defaultValues: StatusFormValues = {
  name: '',
  color: DEFAULT_THEME_COLORS.primary,
};

export const StatusFormModal = ({
  open,
  mode,
  initialValues,
  onCancel,
  onSubmit,
}: StatusFormModalProps) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StatusFormValues>({
    resolver: zodResolver(statusFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: initialValues?.name ?? '',
      color: initialValues?.color ?? DEFAULT_THEME_COLORS.primary,
    });
  }, [initialValues?.color, initialValues?.name, open, reset]);

  return (
    <Modal
      destroyOnHidden
      open={open}
      onCancel={onCancel}
      title={mode === 'create' ? t('kanban.addStatus') : t('kanban.editStatus')}
      footer={[
        <Tooltip key="cancel" title={t('actions.cancel')}>
          <Button aria-label={t('actions.cancel')} icon={<CloseOutlined />} onClick={onCancel} />
        </Tooltip>,
        <Tooltip key="save" title={mode === 'create' ? t('actions.create') : t('actions.save')}>
          <Button
            aria-label={mode === 'create' ? t('actions.create') : t('actions.save')}
            icon={mode === 'create' ? <PlusOutlined /> : <CheckOutlined />}
            loading={isSubmitting}
            onClick={handleSubmit((values) => onSubmit(values))}
            type="primary"
          />
        </Tooltip>,
      ]}
    >
      <Form layout="vertical" onFinish={handleSubmit((values) => onSubmit(values))}>
        <Form.Item
          label={t('kanban.statusForm.name')}
          validateStatus={errors.name ? 'error' : ''}
          help={errors.name?.message}
        >
          <Controller
            control={control}
            name="name"
            render={({ field }) => <Input {...field} autoFocus />}
          />
        </Form.Item>

        <Form.Item
          label={t('kanban.statusForm.color')}
          validateStatus={errors.color ? 'error' : ''}
          help={errors.color?.message}
        >
          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  aria-label={t('kanban.statusForm.color')}
                  onChange={(event) => field.onChange(event.target.value)}
                  style={{ width: 48, height: 36, border: 'none', background: 'transparent', padding: 0 }}
                  type="color"
                  value={field.value}
                />
                <Input {...field} />
              </div>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
