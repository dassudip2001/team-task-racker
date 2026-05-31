interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="h-64 flex flex-col items-center justify-center text-center">
      {icon}

      <p className="text-sm font-semibold mt-2">{title}</p>

      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}
