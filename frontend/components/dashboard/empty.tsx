import { CheckCircle2Icon } from "lucide-react";

export default function EmptyDashboard() {
  return (
    <>
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border/60 rounded-2xl bg-card/45 backdrop-blur-xs max-w-xl mx-auto my-12">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/5 text-primary mb-4 border border-primary/10">
          <CheckCircle2Icon className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold">No Metrics Recorded</h3>
        <p className="text-muted-foreground text-sm max-w-sm mt-2 leading-relaxed">
          The database was successfully queried, but there is no task completion
          data or assignee logs yet. Create a few tasks, assign them, and
          complete them to populate these metrics.
        </p>
      </div>
    </>
  );
}
