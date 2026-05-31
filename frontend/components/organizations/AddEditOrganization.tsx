import { BuildingIcon, Link2Icon } from "lucide-react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function AddEditOrganization() {
  return (
    <>
      <SheetContent className="sm:max-w-md p-6 border-l border-border bg-background">
        <SheetHeader className="space-y-1 mb-6">
          <SheetTitle className="text-xl font-semibold flex items-center gap-2">
            <BuildingIcon className="w-5 h-5 text-primary" />
            Create New Organization
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Set up a new workspace tenant for teams and project resources.
          </SheetDescription>
        </SheetHeader>

        <form className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="org-name"
              className="text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Organization Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="org-name"
              placeholder="e.g. Acme Corporation"
              className="w-full rounded-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="org-slug"
              className="text-xs font-semibold text-foreground uppercase tracking-wider"
            >
              Slug URL identifier <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Input
                id="org-slug"
                placeholder="e.g. acme-corporation"
                className="w-full rounded-lg pr-9"
                required
              />
              <Link2Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal">
              Slugs are URL-safe names containing only lowercase letters,
              numbers, and dashes.
            </p>
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
              {createMutation.isPending ? "Creating..." : "Create Organization"} */}
            </Button>
          </div>
        </form>
      </SheetContent>
    </>
  );
}
