import type { StatusFormValues } from "../status-form.schema";

export type StatusFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<StatusFormValues>;
  onCancel: () => void;
  onSubmit: (values: StatusFormValues) => void;
};
