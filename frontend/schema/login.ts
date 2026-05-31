import { z } from "zod";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const OrganizationSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  slug: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.email(),
});

export const UserProfileSchema = z.object({
  id: z.number(),
  org: OrganizationSchema,
  user: UserSchema,
  role: z.enum(["ADMIN", "MEMBER", "MANAGER"]),
  created_at: z.string(),
  updated_at: z.string(),
});

export const GetUserProfileResponseSchema = z.object({
  success: z.boolean(),
  user: UserProfileSchema,
});

export type GetUserProfileResponse = z.infer<
  typeof GetUserProfileResponseSchema
>;
