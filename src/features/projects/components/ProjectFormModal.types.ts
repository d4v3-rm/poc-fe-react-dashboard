import type { ProjectFormValues } from "../project-form.schema";

export type ProjectFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  initialValues?: Partial<ProjectFormValues>;
  onCancel: () => void;
  onSubmit: (values: ProjectFormValues) => void;
};
