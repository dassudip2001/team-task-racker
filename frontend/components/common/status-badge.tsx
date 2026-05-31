import { Task } from "@/schema/task";
import {
  Loader2Icon,
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon,
  BanIcon,
} from "lucide-react";

export const STATUS_LABELS: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Completed",
  BLOCKED: "Blocked",
};
export default function getStatusBadge(status: Task["status"]) {
  switch (status) {
    case "TODO":
      return (
        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium border border-slate-200 bg-slate-100/80 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
          <ClockIcon className="w-3 h-3 text-slate-500" />
          {STATUS_LABELS[status]}
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300">
          <Loader2Icon className="w-3 h-3 animate-spin text-blue-500" />
          {STATUS_LABELS[status]}
        </span>
      );
    case "IN_REVIEW":
      return (
        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium border border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300">
          <AlertCircleIcon className="w-3 h-3 text-purple-500" />
          {STATUS_LABELS[status]}
        </span>
      );
    case "DONE":
      return (
        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium border border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
          <CheckCircle2Icon className="w-3 h-3 text-emerald-500" />
          {STATUS_LABELS[status]}
        </span>
      );
    case "BLOCKED":
      return (
        <span className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium border border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <BanIcon className="w-3 h-3 text-rose-500" />
          {STATUS_LABELS[status]}
        </span>
      );
  }
}
