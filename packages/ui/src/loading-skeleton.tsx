import { cn } from "./utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

interface EventCardSkeletonProps {
  view?: "grid" | "list";
}

function EventCardSkeleton({ view = "grid" }: EventCardSkeletonProps) {
  if (view === "list") {
    return (
      <div className="rounded-lg border p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-24 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Skeleton className="aspect-video w-full rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-6 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface EventsLoadingProps {
  view?: "grid" | "list";
  count?: number;
}

function EventsLoading({ view = "grid", count = 8 }: EventsLoadingProps) {
  return (
    <div
      className={
        view === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "space-y-4"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} view={view} />
      ))}
    </div>
  );
}

export { Skeleton, EventCardSkeleton, EventsLoading };
