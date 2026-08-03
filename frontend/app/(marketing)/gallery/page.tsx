"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PhotoGrid, PhotoFilters, PhotoLightbox } from "@/components/gallery";
import type { PhotoItem } from "@/components/gallery/PhotoGrid";
import { useDebounce } from "@/hooks/useDebounce";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import { usePhotos } from "@/hooks/usePhotos";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Photo } from "@/lib/types";

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  const debouncedSearch = useDebounce(search, 500);
  const { isAuthenticated } = useAuth();
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading } = usePhotos({
    page: 1,
    limit: 60,
    search: debouncedSearch || undefined,
    category: category !== "all" ? category : undefined,
    sort,
  });

  const photos: PhotoItem[] = (data?.items || []).map((p: Photo) => ({
    id: p.id,
    title: p.title,
    preview_url: p.preview_url,
    download_url: p.download_url,
    width: p.width,
    height: p.height,
    location_name: p.location_name,
    camera_model: p.camera_model,
    category_id: p.category_id,
    is_free: p.is_free,
    price: p.price,
    view_count: p.view_count,
  }));

  useEffect(() => {
    api.get("/categories").then(({ data }) => {
      const items = Array.isArray(data) ? data : [];
      if (items.length > 0) {
        setCategories([
          { value: "all", label: "All Categories" },
          ...items.map((c: { id: string; name: string }) => ({
            value: c.id,
            label: c.name,
          })),
        ]);
      }
    }).catch(() => {});
  }, []);

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

  const handleFavourite = async (photoId: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to save favourites");
      router.push("/login");
      return;
    }
    try {
      await api.post("/favourites/toggle", { photo_id: photoId });
    } catch {
      toast.error("Failed to update favourites");
    }
  };

  const handleAddToCart = (photoId: string) => {
    const item = (data?.items || []).find((p: Photo) => p.id === photoId);
    if (item) addItem(item);
    toast.success("Added to cart");
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
          categories={categories}
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