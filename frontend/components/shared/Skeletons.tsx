import { Skeleton } from "@/components/ui/skeleton";

export function PhotoCardSkeleton() {
  return (
    <div className="break-inside-avoid mb-4">
      <div className="rounded-lg overflow-hidden">
        <Skeleton className="aspect-[4/3]" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function PhotoGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PhotoCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Skeleton className="h-12 w-48" />
      <Skeleton className="h-4 w-96" />
      <PhotoGridSkeleton />
    </div>
  );
}
