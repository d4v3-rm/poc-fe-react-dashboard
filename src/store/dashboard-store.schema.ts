import { z } from "zod";

const hexColorSchema = z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);
const tagSchema = z.array(z.string().trim().min(1).max(36)).default([]);

export const statusSnapshotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  color: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const taskSnapshotSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string(),
  tags: z.array(z.string().trim().min(1).max(36)).default([]),
  statusId: z.string().min(1),
  dueDate: z.string().nullable(),
  order: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const projectSnapshotSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tags: tagSchema,
  statuses: z.array(statusSnapshotSchema).min(1),
  tasks: z.array(taskSnapshotSchema),
});

export const dashboardStoreSnapshotSchema = z.object({
  projects: z.array(projectSnapshotSchema),
  activeProjectId: z.string().nullable(),
  viewMode: z.enum(["list", "kanban"]),
  filters: z.object({
    query: z.string(),
    statusIds: z.array(z.string()),
    tagIds: z.array(z.string()).default([]),
    due: z.enum(["all", "overdue", "today", "week", "no_due"]),
  }),
  language: z.enum(["en", "it"]),
  themeMode: z.enum(["light", "dark"]).default("dark"),
  themeColors: z
    .object({
      primary: hexColorSchema.optional(),
      secondary: hexColorSchema.optional(),
    })
    .default({
      primary: "#0D8BFF",
    })
    .transform((colors) => ({
      primary: colors.primary ?? "#0D8BFF",
    })),
});

export type DashboardStoreSnapshotSchema = z.infer<
  typeof dashboardStoreSnapshotSchema
>;
