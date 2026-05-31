import { z } from "zod";

export const CreateTaskSchema = z.object({
  project: z.string().min(1, "Project is required"),
  assignee: z.number().min(1, "Assignee is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE", "BLOCKED"]),
  due_date: z.string().nullable(),
});

export const TaskSchema = CreateTaskSchema.extend({
  id: z.string(),
  created_by: z.number(),
  project_name: z.string(),
  assignee_name: z.string().nullable(),
  created_by_name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;

export interface TaskResponse {
  page: number;
  limit: number;
  total: number;
  results: Task[];
}

export const VALID_TRANSITIONS: Record<string, string[]> = {
  TODO: ["IN_PROGRESS", "BLOCKED"],
  IN_PROGRESS: ["IN_REVIEW", "BLOCKED"],
  IN_REVIEW: ["DONE", "BLOCKED"],
  DONE: [],
  BLOCKED: [],
};

export const TRANSITION_ACTIONS: Record<
  string,
  { label: string; variant: string }
> = {
  IN_PROGRESS: { label: "Start work", variant: "bg-blue-500 text-white" },
  IN_REVIEW: { label: "Request review", variant: "bg-purple-500 text-white" },
  DONE: { label: "Complete task", variant: "bg-emerald-500 text-white" },
  BLOCKED: { label: "Block", variant: "bg-rose-500 text-white" },
};
