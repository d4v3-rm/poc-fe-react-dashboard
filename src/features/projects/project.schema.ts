import { z } from 'zod';

export const projectFormSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(280).optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;
