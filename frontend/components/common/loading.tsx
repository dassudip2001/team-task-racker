export default function Loading() {
  return (
    <>
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-4 border-b border-border/40 pb-4">
          <div className="h-6 bg-muted animate-pulse rounded-md w-1/4"></div>
          <div className="h-6 bg-muted animate-pulse rounded-md w-1/4"></div>
          <div className="h-6 bg-muted animate-pulse rounded-md w-1/5"></div>
          <div className="h-6 bg-muted animate-pulse rounded-md w-1/12 ml-auto"></div>
        </div>
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center space-x-4 py-3">
            <div className="h-4 bg-muted/70 animate-pulse rounded-md w-1/4"></div>
            <div className="h-4 bg-muted/70 animate-pulse rounded-md w-1/4"></div>
            <div className="h-4 bg-muted/70 animate-pulse rounded-md w-1/5"></div>
            <div className="h-7 bg-muted/70 animate-pulse rounded-md w-7 ml-auto"></div>
          </div>
        ))}
      </div>
    </>
  );
}
