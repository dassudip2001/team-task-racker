import { ActivityIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function DashboardHeader({
  handleRefresh,
  isLoading,
  isFetching,
}: {
  handleRefresh: () => void;
  isLoading: boolean;
  isFetching: boolean;
}) {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <ActivityIcon className="w-5 h-5" />
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Team Performance
            </h2>
          </div>
          <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed max-w-2xl">
            Analyze bottlenecks, average resolution cycles, and resource load
            distribution across all teammates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isFetching}
            className="gap-2 cursor-pointer h-9 px-3 border-border/60 hover:bg-muted/40 transition-colors"
            title="Reload data"
          >
            <RefreshCwIcon
              className={`w-4 h-4 text-muted-foreground ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>
    </>
  );
}
