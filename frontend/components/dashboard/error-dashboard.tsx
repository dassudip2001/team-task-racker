import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function DashboardError({
  handleRefresh,
}: {
  handleRefresh: () => void;
}) {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-destructive/30 rounded-2xl bg-destructive/5 backdrop-blur-xs max-w-2xl mx-auto my-12">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-destructive/10 text-destructive mb-4 border border-destructive/20 animate-pulse">
          <AlertCircleIcon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold tracking-tight text-foreground">
          API Connection Issue
        </h3>
        <p className="text-muted-foreground text-sm max-w-md mt-2.5 leading-relaxed">
          We couldn't retrieve tasks analytics from your backend endpoint{" "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-destructive">
            /api/tasks/analytics
          </code>
          . Make sure your local server is running at{" "}
        </p>
        <Button
          variant="outline"
          onClick={handleRefresh}
          className="gap-2 border-border/80 hover:bg-muted/40 cursor-pointer rounded-lg mt-6"
        >
          <RefreshCwIcon className="w-4 h-4" />
          Retry Connection
        </Button>
      </div>
    </>
  );
}
