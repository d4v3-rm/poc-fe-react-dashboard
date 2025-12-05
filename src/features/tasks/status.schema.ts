import { z } from "zod";

export const statusFormSchema = z.object({
  name: z.string().trim().min(2).max(36),
  color: z
    .string()
    .trim()
    .regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/),
});

export type StatusFormValues = z.infer<typeof statusFormSchema>;
