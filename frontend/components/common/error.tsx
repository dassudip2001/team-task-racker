export default function Error({ message }: { message: string }) {
  return (
    <div className="p-8 text-center">
      <p className="text-destructive font-medium">
        {message || "Error loading data."}
      </p>
      <p className="text-muted-foreground text-sm mt-1">
        {"Something went wrong."}
      </p>
    </div>
  );
}
