import { FolderIcon } from "lucide-react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function AddEditProjects() {
  return (
    <>
      <SheetContent className="sm:max-w-md p-6 border-l border-border bg-background">
        <SheetHeader className="space-y-1 mb-6">
          <SheetTitle className="text-xl font-semibold flex items-center gap-2">
            <FolderIcon className="w-5 h-5 text-primary" />
            Create New Project
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Add a new project to structure tasks and organize your workflow.
          </SheetDescription>
        </SheetHeader>

        <form className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="proj-name"
              className="text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Project Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="proj-name"
              placeholder="e.g. Website Redesign"
              className="w-full rounded-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="proj-desc"
              className="text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Description
            </label>
            <textarea
              id="proj-desc"
              placeholder="Summarize the project goals, scope, and key deliverables..."
              rows={4}
              className="flex min-h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
              {/* {createMutation.isPending && (
                <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
              )}
              {createMutation.isPending ? "Creating..." : "Create Project"} */}
            </Button>
          </div>
        </form>
      </SheetContent>
    </>
  );
}
