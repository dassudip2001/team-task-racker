export function formatDuration(seconds: number): string {
  if (seconds === undefined || seconds === null || seconds <= 0) return "N/A";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (days === 0 && mins > 0) parts.push(`${mins}m`);

  return parts.join(" ") || `${seconds.toFixed(0)}s`;
}

export function getEfficiencyTier(seconds: number) {
  if (!seconds || seconds <= 0)
    return { label: "Unknown", color: "text-muted-foreground bg-muted" };
  const hours = seconds / 3600;
  if (hours <= 6) {
    return {
      label: "Elite Speed",
      color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/25",
    };
  } else if (hours <= 18) {
    return {
      label: "Rapid",
      color: "bg-teal-500/10 text-teal-500 border-teal-500/25",
    };
  } else if (hours <= 30) {
    return {
      label: "On Track",
      color: "bg-sky-500/10 text-sky-500 border-sky-500/25",
    };
  } else {
    return {
      label: "Needs Review",
      color: "bg-amber-500/10 text-amber-500 border-amber-500/25",
    };
  }
}

export function getAvatarFallback(username: string) {
  return username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
