import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface OverdueUser {
  assignee_id: number | string;
  username: string;
  overdue_count: number;
}

interface OverdueRowProps {
  user: OverdueUser;
  maxOverdue: number;
  hoveredBar: string | null;
  setHoveredBar: (value: string | null) => void;
  getAvatarFallback: (name: string) => string;
}

export function OverdueRow({
  user,
  maxOverdue,
  hoveredBar,
  setHoveredBar,
  getAvatarFallback,
}: OverdueRowProps) {
  const percent = (user.overdue_count / maxOverdue) * 100;

  return (
    <div
      className="group/row flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-muted/10 transition-colors"
      onMouseEnter={() => setHoveredBar(`overdue-${user.assignee_id}`)}
      onMouseLeave={() => setHoveredBar(null)}
    >
      <div className="flex items-center gap-3 w-40 shrink-0">
        <Avatar className="w-7 h-7 border border-border/80">
          <AvatarFallback className="text-[10px] font-bold bg-muted">
            {getAvatarFallback(user.username)}
          </AvatarFallback>
        </Avatar>

        <span className="text-xs font-semibold truncate">{user.username}</span>
      </div>

      <div className="flex-1 h-3 rounded-full bg-muted/40 overflow-hidden relative border border-border/20">
        <div
          style={{ width: `${percent}%` }}
          className={`h-full rounded-full transition-all duration-500 bg-linear-to-r ${
            user.overdue_count >= 4
              ? "from-rose-500 to-rose-600 shadow-[0_0_8px_rgba(244,63,94,0.3)]"
              : user.overdue_count >= 2
                ? "from-amber-400 to-amber-500"
                : "from-blue-400 to-blue-500"
          }`}
        />

        {hoveredBar === `overdue-${user.assignee_id}` && (
          <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none" />
        )}
      </div>

      <div className="w-16 text-right shrink-0">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            user.overdue_count >= 4
              ? "bg-rose-500/10 text-rose-500"
              : user.overdue_count >= 1
                ? "bg-amber-500/10 text-amber-500"
                : "bg-emerald-500/10 text-emerald-500"
          }`}
        >
          {user.overdue_count} task
          {user.overdue_count !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
