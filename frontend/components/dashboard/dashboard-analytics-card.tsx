import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AnalyticsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
}

export function AnalyticsCard({
  title,
  description,
  icon,
  badge,
  children,
}: AnalyticsCardProps) {
  return (
    <Card className="border-border/40 bg-card/45 backdrop-blur-xs shadow-xs hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {icon}
            <CardTitle className="text-lg font-bold">{title}</CardTitle>
          </div>

          {badge}
        </div>

        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>

      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}
