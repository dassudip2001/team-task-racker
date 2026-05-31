import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  org: z.string().min(1, "Organization is required"),
  description: z.string().optional(),
});

export const ProjectSchema = CreateProjectSchema.extend({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
