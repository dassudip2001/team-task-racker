import { z } from "zod";
export const OrganizationCreateSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z.string(),
});
export const OrganizationSchema = OrganizationCreateSchema.extend({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Organization = z.infer<typeof OrganizationSchema>;
export type OrganizationCreateInput = z.infer<typeof OrganizationCreateSchema>;
