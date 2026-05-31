import { TagIcon } from "lucide-react";
import { SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { ModalAction } from "@/types/generic";
import { Task } from "@/schema/task";

export default function AddEditTask({
  isOpen,
  setIsOpen,
  action = ModalAction.ADD,
  task,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  action?: ModalAction;
  task?: Task | null;
}) {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md p-6 border-l border-border bg-background">
          <SheetHeader className="space-y-1 mb-6">
            <SheetTitle className="text-xl font-semibold flex items-center gap-2">
              <TagIcon className="w-5 h-5 text-primary" />
              Create New Task
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Create a task to assign work items and track statuses.
            </SheetDescription>
          </SheetHeader>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="task-title"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Task Title <span className="text-destructive">*</span>
              </label>
              <Input
                id="task-title"
                placeholder="e.g. Design Landing Page"
                className="rounded-lg"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="task-proj"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Project <span className="text-destructive">*</span>
              </label>
              <select
                id="task-proj"
                className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="" className="text-muted-foreground">
                  Select Project...
                </option>
                {/* {projects?.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))} */}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="task-priority"
                  className="text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Priority
                </label>
                <select
                  id="task-priority"
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-hidden"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="task-assignee"
                  className="text-xs font-semibold text-foreground uppercase tracking-wider"
                >
                  Assignee
                </label>
                <select
                  id="task-assignee"
                  className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-hidden"
                >
                  <option value="unassigned">Unassigned</option>
                  {/* {user?.user?.user && (
                  <option value={user.user.user.id}>
                    {user.user.user.username} (Me)
                  </option>
                )} */}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="task-duedate"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Due Date
              </label>
              <Input
                id="task-duedate"
                type="date"
                className="rounded-lg text-sm block w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="task-desc"
                className="text-xs font-semibold text-foreground uppercase tracking-wider"
              >
                Description
              </label>
              <textarea
                id="task-desc"
                placeholder="Describe the task and any technical notes..."
                rows={3}
                className="flex min-h-15 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-border/40">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-lg cursor-pointer bg-primary text-primary-foreground flex items-center gap-1.5"
              >
                {/* {createTaskMutation.isPending && (
                <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
              )}
              {createTaskMutation.isPending ? "Creating..." : "Create Task"} */}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
