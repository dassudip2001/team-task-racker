"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import {
  PlusIcon,
  Trash2Icon,
  CalendarIcon,
  CheckCircle2Icon,
  SearchIcon,
  FilterIcon,
  UserIcon,
  ArrowRightIcon,
} from "lucide-react";
import Loading from "@/components/common/loading";
import Error from "@/components/common/error";
import getStatusBadge from "@/components/common/status-badge";
import getPriorityBadge from "@/components/common/priority";
import {
  TaskResponse,
  TRANSITION_ACTIONS,
  VALID_TRANSITIONS,
} from "@/schema/task";

export default function TasksPage() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [priorityFilter, setPriorityFilter] = React.useState("ALL");

  const {
    data: taskData,
    isLoading,
    isError,
  } = useQuery<TaskResponse>({
    queryKey: ["tasks", statusFilter, priorityFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (priorityFilter !== "ALL") params.append("priority", priorityFilter);
      const res = await api.get(`/tasks/?${params.toString()}`);
      return res.data;
    },
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: string;
      newStatus: string;
    }) => {
      const res = await api.patch(`/tasks/${id}/status/`, {
        status: newStatus,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update status.";
      toast.error(message);
    },
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  const tasksList = taskData?.results || [];
  const filteredTasks = tasksList.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header section with Title, Subtitle, and Add Button */}
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/75 bg-clip-text text-transparent">
            Tasks
          </h2>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Track, prioritize, and collaborate on tasks across your team.
          </p>
        </div>

        <Button
          size="lg"
          className="shadow-xs hover:shadow-md transition-all gap-2 cursor-pointer bg-primary text-primary-foreground font-medium rounded-lg"
        >
          <PlusIcon className="w-4 h-4" />
          New Task
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/25 p-4 rounded-xl border border-border/50 backdrop-blur-xs">
        <div className="relative w-full md:w-80">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 w-full rounded-lg"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3 items-center">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium whitespace-nowrap">
            <FilterIcon className="w-3.5 h-3.5" />
            Filter by:
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-xs shadow-xs focus-visible:outline-hidden font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Completed</option>
            <option value="BLOCKED">Blocked</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 py-1 text-xs shadow-xs focus-visible:outline-hidden font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/45 backdrop-blur-xs shadow-xs overflow-hidden">
        {isLoading ? (
          <Loading />
        ) : isError ? (
          <Error message={"Failed to load tasks."} />
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center select-none">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/5 text-primary mb-4 border border-primary/10">
              <CheckCircle2Icon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold">No tasks found</h3>
            <p className="text-muted-foreground max-w-sm mt-2 text-sm leading-relaxed">
              {searchTerm || statusFilter !== "ALL" || priorityFilter !== "ALL"
                ? "No tasks match your current search queries or filter selections."
                : "Your organization does not have any tasks yet. Create one to begin tracking."}
            </p>
            {!searchTerm &&
              statusFilter === "ALL" &&
              priorityFilter === "ALL" && (
                <Button className="mt-5 rounded-lg cursor-pointer shadow-xs hover:shadow-md transition-all gap-1.5">
                  <PlusIcon className="w-4 h-4" />
                  Create Task
                </Button>
              )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-4 px-6">Task</th>
                  <th className="py-4 px-6">Project</th>
                  <th className="py-4 px-6">Assignee</th>
                  <th className="py-4 px-6">Priority</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredTasks.map((task) => {
                  const nextTransitions = VALID_TRANSITIONS[task.status] || [];

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-muted/15 transition-colors group/row"
                    >
                      <td className="py-4 px-6 max-w-xs md:max-w-md">
                        <div className="font-semibold text-foreground">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-xs text-muted-foreground/80 mt-1 line-clamp-1">
                            {task.description}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-6 text-muted-foreground text-sm whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                          {task.project_name}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-muted-foreground text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
                          <span>
                            {task.assignee_name || (
                              <span className="text-muted-foreground/40 italic">
                                Unassigned
                              </span>
                            )}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        {getPriorityBadge(task.priority)}
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2 group/status">
                          {getStatusBadge(task.status)}

                          {nextTransitions.length > 0 && (
                            <div className="opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center gap-1 bg-background border border-border/80 shadow-xs rounded-lg p-0.5">
                              {nextTransitions.map((nextStatus) => {
                                const action = TRANSITION_ACTIONS[
                                  nextStatus
                                ] || {
                                  label: `Move to ${nextStatus}`,
                                  variant: "bg-slate-200 text-slate-800",
                                };
                                return (
                                  <button
                                    key={nextStatus}
                                    onClick={() =>
                                      handleStatusChange(task.id, nextStatus)
                                    }
                                    title={action.label}
                                    className="cursor-pointer text-[10px] font-bold uppercase tracking-wider py-0.5 px-2.5 rounded-md hover:brightness-90 transition-all flex items-center gap-1 bg-muted hover:bg-muted/80 text-foreground"
                                    disabled={updateStatusMutation.isPending}
                                  >
                                    <ArrowRightIcon className="w-2.5 h-2.5" />
                                    {nextStatus === "IN_PROGRESS"
                                      ? "Start"
                                      : nextStatus === "IN_REVIEW"
                                        ? "Review"
                                        : nextStatus === "DONE"
                                          ? "Done"
                                          : nextStatus}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Due Date */}
                      <td className="py-4 px-6 text-muted-foreground text-sm whitespace-nowrap">
                        {task.due_date ? (
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground/60" />
                            <span>
                              {new Date(task.due_date).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30">—</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => {
                            console.log("....");
                          }}
                          title="Delete task"
                          className=" rounded-md cursor-pointer"
                        >
                          <Trash2Icon className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
