interface CompletionUser {
  assignee_id: number;
  username: string;
  avg_completion_seconds: number;
}

interface CompletionBarProps {
  user: CompletionUser;
  maxCompletionSeconds: number;
  hoveredBar: string | null;
  setHoveredBar: (value: string | null) => void;
  formatDuration: (seconds: number) => string;
}

export function CompletionBar({
  user,
  maxCompletionSeconds,
  hoveredBar,
  setHoveredBar,
  formatDuration,
}: CompletionBarProps) {
  const heightPercent = Math.max(
    (user.avg_completion_seconds / maxCompletionSeconds) * 80,
    8,
  );

  const isHovered = hoveredBar === `completion-${user.assignee_id}`;

  return (
    <div
      className="flex flex-col items-center group w-14 max-w-14 relative"
      onMouseEnter={() => setHoveredBar(`completion-${user.assignee_id}`)}
      onMouseLeave={() => setHoveredBar(null)}
    >
      <div
        className={`absolute -top-12 z-10 bg-popover text-popover-foreground border border-border/80 text-[10px] font-semibold py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap transition-all duration-200 ${
          isHovered
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <div className="font-bold text-center">
          {formatDuration(user.avg_completion_seconds)}
        </div>

        <div className="text-[8px] text-muted-foreground">avg completion</div>
      </div>

      <div className="w-7 rounded-t-lg bg-muted/30 border-x border-t border-border/20 h-40 flex items-end overflow-hidden mb-2 relative">
        <div
          style={{ height: `${heightPercent}%` }}
          className={`w-full rounded-t-md bg-linear-to-t transition-all duration-500 ${
            user.avg_completion_seconds <= 43200
              ? "from-emerald-500 to-teal-400"
              : user.avg_completion_seconds <= 86400
                ? "from-blue-500 to-cyan-400"
                : "from-indigo-600 to-violet-500"
          }`}
        />

        {isHovered && (
          <div className="absolute inset-0 bg-white/10 pointer-events-none" />
        )}
      </div>

      <span className="text-[10px] font-semibold text-muted-foreground truncate w-full text-center">
        {user.username.split(" ")[0]}
      </span>
    </div>
  );
}
