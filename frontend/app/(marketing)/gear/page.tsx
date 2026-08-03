"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import type { PhotoItem } from "@/components/gallery/PhotoGrid";
import api from "@/lib/api";
import type { Photo } from "@/lib/types";

export default function GearPage() {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [brands, setBrands] = useState<string[]>(["All"]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await api.get("/photos", { params: { limit: 100 } });
        if (cancelled) return;
        const items: Photo[] = data?.items ?? [];
        const mapped: PhotoItem[] = items.map((p: Photo) => ({
          id: p.id,
          title: p.title,
          preview_url: p.preview_url,
          download_url: p.download_url,
          is_free: p.is_free,
          price: p.price,
          view_count: p.view_count,
          camera_make: p.camera_make,
          camera_model: p.camera_model,
          lens: p.lens,
          aperture: p.aperture,
          shutter_speed: p.shutter_speed,
          iso: p.iso,
        }));
        setPhotos(mapped);
        const found = Array.from(
          new Set(items.map((p) => p.camera_make).filter((m): m is string => !!m))
        );
        if (found.length > 0) setBrands(["All", ...found]);
      } catch {
        setPhotos([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPhotos =
    selectedBrand === "All"
      ? photos
      : photos.filter((p) => p.camera_make === selectedBrand);

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/30">
          <Camera className="h-3.5 w-3.5" />
          <span>Camera Gear Explorer</span>
        </div>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl">
          Browse by <span className="gold-gradient-text">Camera & Lens</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Discover how different camera bodies, focal lengths, and aperture settings create distinctive visual aesthetics.
        </p>
      </div>

      {/* Brand Filter Buttons */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {brands.map((brand) => (
          <Button
            key={brand}
            variant={selectedBrand === brand ? "default" : "outline"}
            className={
              selectedBrand === brand
                ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                : "border-border/60 hover:bg-muted"
            }
            onClick={() => setSelectedBrand(brand)}
          >
            {brand}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/3] bg-muted/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground text-center">
            {filteredPhotos.length} photograph{filteredPhotos.length !== 1 ? "s" : ""} with
            camera metadata
          </p>

          <PhotoGrid
            photos={filteredPhotos}
            onOpenLightbox={(photo) => {
              const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
              setLightboxIndex(idx >= 0 ? idx : 0);
            }}
          />

          {filteredPhotos.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No photographs with camera metadata found.
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((prev) =>
              prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : prev
            )
          }
          onPrevious={() =>
            setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
          }
        />
      )}
    </div>
  );
}