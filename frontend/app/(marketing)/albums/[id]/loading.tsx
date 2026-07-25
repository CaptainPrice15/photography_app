import { Skeleton } from "@/components/ui/skeleton";

export default function AlbumDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="aspect-[21/9] w-full rounded-lg" />
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
