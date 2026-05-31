import { Card, CardContent, CardHeader } from "../ui/card";

interface DashboardCardProps {
  cardheaderText: string;
  value: string | number;
  icon: React.ReactNode;
  status?: "success" | "danger" | "warning" | "neutral";
  children?: React.ReactNode;
}

export default function DashboardCard({
  cardheaderText,
  value,
  icon,
  status = "neutral",
  children,
}: DashboardCardProps) {
  const statusStyles = {
    success: "bg-emerald-500/10 text-emerald-500",
    danger: "bg-rose-500/10 text-rose-500",
    warning: "bg-amber-500/10 text-amber-500",
    neutral: "bg-muted text-muted-foreground",
  };

  return (
    <Card className="border-border/40 bg-card/45 backdrop-blur-xs hover:border-border/80 transition-all duration-300 shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {cardheaderText}
        </span>

        <div className={`p-1.5 rounded-md ${statusStyles[status]}`}>{icon}</div>
      </CardHeader>

      <CardContent>
        <div className="text-lg font-bold truncate">{value}</div>

        {children}
      </CardContent>
    </Card>
  );
}
