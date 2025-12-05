import { z } from "zod";

type FormTranslator = (key: string) => string;

export const createProjectFormSchema = (t: FormTranslator) =>
  z.object({
    name: z.string().trim().min(2, t("validation.minName")).max(60),
    description: z.string().trim().max(280).optional(),
    tags: z.array(z.string().trim().min(1).max(36)),
  });

export type ProjectFormValues = z.infer<
  ReturnType<typeof createProjectFormSchema>
>;
