import dayjs, { type Dayjs } from 'dayjs';
import { z } from 'zod';

const dayjsSchema = z.custom<Dayjs>((value) => dayjs.isDayjs(value), {
  message: 'Invalid date',
});

export const taskFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  content: z.string().trim().max(12000),
  statusId: z.string().trim().min(1),
  dueDate: z.union([dayjsSchema, z.null()]),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
