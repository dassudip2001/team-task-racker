"use client";

import axios from "axios";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteProp {
  recordId: string;
  isOpenDelete: boolean;
  open: (isOpen: boolean) => void;
  modelName: string;
  onReload?: () => void;
}

export default function DeleteModel({
  recordId,
  open,
  isOpenDelete,
  modelName,
  onReload,
}: DeleteProp) {
  const queryClient = useQueryClient();

  const deleteUrlMap: Record<string, string> = {
    Task: "/tasks/",
    Projects: "/projects/",
    Organizations: "/organizations/",
  };

  const queryKeyMap: Record<string, string[]> = {
    Task: ["tasks"],
    Projects: ["projects"],
    Organizations: ["organizations"],
  };

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      if (!recordId) return;
      const baseUrl = deleteUrlMap[modelName];
      if (!baseUrl) {
        throw new Error(`Unsupported model for deletion: ${modelName}`);
      }
      await axios.delete(`${baseUrl}/${recordId}`);
    },
    onSuccess: async () => {
      toast.success(`${modelName} deleted successfully`);
      const queryKey = queryKeyMap[modelName];
      if (queryKey) {
        await queryClient.invalidateQueries({ queryKey });
      }
      onReload?.();
      open(false);
    },
    onError: (error) => {
      console.error(`Error deleting ${modelName}:`, error);
      toast.error(`Failed to delete ${modelName}`);
    },
  });

  return (
    <Dialog onOpenChange={open} open={isOpenDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the{" "}
            <span className="font-semibold">{modelName}</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={() => mutateAsync()}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
