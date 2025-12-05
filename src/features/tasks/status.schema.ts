import { z } from "zod";

type FormTranslator = (key: string) => string;

export const createStatusFormSchema = (t: FormTranslator) =>
  z.object({
    name: z.string().trim().min(2, t("validation.minName")).max(36),
    color: z
      .string()
      .trim()
      .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, t("validation.color")),
  });

export type StatusFormValues = z.infer<
  ReturnType<typeof createStatusFormSchema>
>;
