import { Card, CardHeader, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/40 bg-card/45">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 rounded-md mb-1" />
                <Skeleton className="h-3.5 w-36 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <Card key={i} className="border-border/40 bg-card/45 h-96">
              <CardHeader>
                <Skeleton className="h-5 w-48 rounded-md mb-2" />
                <Skeleton className="h-3.5 w-64 rounded-md" />
              </CardHeader>
              <CardContent className="h-72 flex items-center justify-center">
                <Skeleton className="h-5/6 w-11/12 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
