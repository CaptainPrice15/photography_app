"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PhotoGrid, PhotoFilters, PhotoLightbox } from "@/components/gallery";
import { useDebounce } from "@/hooks/useDebounce";
import api from "@/lib/api";

interface Photo {
  id: string;
  title: string;
  thumbnail_url: string;
  original_url?: string;
  category?: string;
  is_free: boolean;
  price?: number;
  view_count?: number;
}

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (category && category !== "all") params.set("category", category);

        const { data } = await api.get(`/photos/all?${params.toString()}`);
        const items = Array.isArray(data) ? data : data.items || [];

        const mapped: Photo[] = items.map((p: any) => ({
          id: p.id,
          title: p.title || p.alt || "",
          thumbnail_url: p.src || p.thumbnail_url || "/images/placeholder.jpg",
          original_url: p.src || p.original_url || undefined,
          category: p.collectionId || undefined,
          is_free: true,
          price: undefined,
          view_count: undefined,
        }));

        let filtered = mapped;

        if (sort === "popular") {
          filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        } else if (sort === "price_asc") {
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sort === "price_desc") {
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        }

        setPhotos(filtered);
      } catch {
        setPhotos([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [debouncedSearch, category, sort]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`/gallery?${params.toString()}`);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`/gallery?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    setSort(value);
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    router.push(`/gallery?${params.toString()}`);
  };

  const handleFavourite = (photoId: string) => {
    console.log("Favourite:", photoId);
    // TODO: Implement favourite API call
  };

  const handleAddToCart = (photoId: string) => {
    console.log("Add to cart:", photoId);
    // TODO: Implement add to cart API call
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Gallery</h1>
        <p className="text-muted-foreground">
          Browse through the complete collection of photographs
        </p>
      </motion.div>

      {/* Filters */}
      <div className="mb-8">
        <PhotoFilters
          search={search}
          category={category}
          sort={sort}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-6">
            Showing {photos.length} photo{photos.length !== 1 ? "s" : ""}
          </p>

          {/* Photo grid */}
          <PhotoGrid
            photos={photos}
            onFavourite={handleFavourite}
            onAddToCart={handleAddToCart}
            onOpenLightbox={(photo) => {
              const idx = photos.findIndex((p) => p.id === photo.id);
              setLightboxIndex(idx >= 0 ? idx : 0);
            }}
          />

          {/* Lightbox */}
          {lightboxIndex !== null && (
            <PhotoLightbox
              photos={photos}
              currentIndex={lightboxIndex}
              isOpen={lightboxIndex !== null}
              onClose={() => setLightboxIndex(null)}
              onNext={() =>
                setLightboxIndex((prev) =>
                  prev !== null && prev < photos.length - 1 ? prev + 1 : prev
                )
              }
              onPrevious={() =>
                setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
              }
            />
          )}

          {/* Empty state */}
          {photos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground mb-4">
                No photos found matching your criteria
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setSort("newest");
                  router.push("/gallery");
                }}
                className="text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
