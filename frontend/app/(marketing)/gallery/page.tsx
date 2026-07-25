"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { PhotoGrid, PhotoFilters } from "@/components/gallery";
import { useDebounce } from "@/hooks/useDebounce";

interface Photo {
  id: string;
  title: string;
  thumbnail_url: string;
  category?: string;
  is_free: boolean;
  price?: number;
  view_count?: number;
}

const MOCK_PHOTOS: Photo[] = [
  { id: "1", title: "Mountain Sunrise", thumbnail_url: "/images/placeholder.jpg", category: "Landscapes", is_free: false, price: 49.99, view_count: 1250 },
  { id: "2", title: "Urban Street", thumbnail_url: "/images/placeholder.jpg", category: "Street", is_free: true, view_count: 890 },
  { id: "3", title: "Portrait Study", thumbnail_url: "/images/placeholder.jpg", category: "Portraits", is_free: false, price: 39.99, view_count: 2100 },
  { id: "4", title: "Ocean Waves", thumbnail_url: "/images/placeholder.jpg", category: "Nature", is_free: false, price: 59.99, view_count: 1560 },
  { id: "5", title: "City Lights", thumbnail_url: "/images/placeholder.jpg", category: "Street", is_free: true, view_count: 780 },
  { id: "6", title: "Forest Path", thumbnail_url: "/images/placeholder.jpg", category: "Nature", is_free: false, price: 44.99, view_count: 1890 },
  { id: "7", title: "Desert Dunes", thumbnail_url: "/images/placeholder.jpg", category: "Landscapes", is_free: false, price: 54.99, view_count: 1340 },
  { id: "8", title: "Vintage Car", thumbnail_url: "/images/placeholder.jpg", category: "Street", is_free: true, view_count: 670 },
  { id: "9", title: "Autumn Colors", thumbnail_url: "/images/placeholder.jpg", category: "Nature", is_free: false, price: 42.99, view_count: 2230 },
];

export default function GalleryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [photos, setPhotos] = useState<Photo[]>(MOCK_PHOTOS);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      let filtered = [...MOCK_PHOTOS];

      if (debouncedSearch) {
        filtered = filtered.filter((p) =>
          p.title.toLowerCase().includes(debouncedSearch.toLowerCase())
        );
      }

      if (category && category !== "all") {
        filtered = filtered.filter(
          (p) => p.category?.toLowerCase() === category.toLowerCase()
        );
      }

      // Sort
      switch (sort) {
        case "popular":
          filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
          break;
        case "price_asc":
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case "price_desc":
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        default: // newest
          break;
      }

      setPhotos(filtered);
      setIsLoading(false);
    }, 300);
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
          />

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
