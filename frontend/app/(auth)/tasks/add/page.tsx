"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { Loader2Icon, TagIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
}

export default function AddTaskPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useUserStore();

  // Form State
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [projectId, setProjectId] = React.useState("");
  const [assigneeId, setAssigneeId] = React.useState<string>("unassigned");
  const [priority, setPriority] = React.useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [dueDate, setDueDate] = React.useState("");

  // Fetch projects
  const { data: projects, isLoading: loadingProjects } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get("/projects/");
      return res.data;
    },
  });

  // Create Task Mutation
  const createTaskMutation = useMutation({
    mutationFn: async (newTask: any) => {
      const res = await api.post("/tasks/", newTask);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      router.push("/tasks");
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || err?.message || "Failed to create task.";
      toast.error(message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task title is required.");
      return;
    }
    if (!projectId) {
      toast.error("Please select a project.");
      return;
    }

    const payload: any = {
      title,
      description,
      project: projectId,
      priority,
      status: "TODO",
    };

    if (assigneeId !== "unassigned") {
      payload.assignee = parseInt(assigneeId);
    }
    if (dueDate) {
      payload.due_date = new Date(dueDate).toISOString();
    }

    createTaskMutation.mutate(payload);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 pb-4 border-b border-border/40">
        <Link href="/tasks">
          <Button variant="ghost" size="icon-sm" className="rounded-lg cursor-pointer">
            <ArrowLeftIcon className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Create Task</h2>
          <p className="text-muted-foreground text-xs">
            Back to tasks directory
          </p>
        </div>
      </div>

      <Card className="rounded-xl border border-border/60 bg-card/45 backdrop-blur-xs shadow-xs overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-primary" />
            Task Details
          </CardTitle>
          <CardDescription className="text-xs">
            Provide details to log a new task in your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="full-task-title" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Task Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="full-task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Set up CI/CD pipeline"
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="full-task-proj" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Project <span className="text-destructive">*</span>
              </label>
              {loadingProjects ? (
                <div className="h-9 rounded-lg bg-muted animate-pulse w-full"></div>
              ) : (
                <select
                  id="full-task-proj"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option value="">Select Project...</option>
                  {projects?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="full-task-priority" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Priority
                </label>
                <select
                  id="full-task-priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-hidden"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="full-task-assignee" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  Assignee
                </label>
                <select
                  id="full-task-assignee"
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-hidden"
                >
                  <option value="unassigned">Unassigned</option>
                  {user?.user?.user && (
                    <option value={user.user.user.id}>{user.user.user.username} (Me)</option>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="full-task-duedate" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Due Date
              </label>
              <Input
                id="full-task-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-lg text-sm block w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="full-task-desc" className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Description
              </label>
              <textarea
                id="full-task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write description about the task deliverables..."
                rows={4}
                className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border/40">
              <Link href="/tasks">
                <Button type="button" variant="outline" className="rounded-lg cursor-pointer">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                className="rounded-lg cursor-pointer bg-primary text-primary-foreground flex items-center gap-1.5"
                disabled={createTaskMutation.isPending}
              >
                {createTaskMutation.isPending && <Loader2Icon className="w-3.5 h-3.5 animate-spin" />}
                {createTaskMutation.isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
