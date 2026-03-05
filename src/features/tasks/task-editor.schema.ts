import dayjs, { type Dayjs } from "dayjs";
import { z } from "zod";

type FormTranslator = (key: string) => string;

export const createTaskFormSchema = (t: FormTranslator) => {
  const dayjsSchema = z.custom<Dayjs>((value) => dayjs.isDayjs(value), {
    message: t("validation.invalidDate"),
  });

  return z.object({
    title: z.string().trim().min(2, t("validation.minName")).max(120),
    tags: z.array(z.string().trim().min(1).max(36)),
    content: z.string().trim().max(12000),
    statusId: z.string().trim().min(1, t("validation.required")),
    dueDate: z.union([dayjsSchema, z.null()]),
  });
};

export type TaskFormValues = z.infer<ReturnType<typeof createTaskFormSchema>>;
