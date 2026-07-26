import { Skeleton } from "@/components/ui/skeleton";

export default function FavouritesLoading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="break-inside-avoid mb-4">
            <Skeleton className="aspect-[4/3] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
