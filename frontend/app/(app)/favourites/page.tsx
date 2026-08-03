"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Heart, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PhotoGrid, PhotoLightbox } from "@/components/gallery";
import type { PhotoItem } from "@/components/gallery/PhotoGrid";
import { EmptyState } from "@/components/shared/EmptyState";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Photo } from "@/lib/types";

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadFavourites = useCallback(async () => {
    try {
      const { data } = await api.get("/favourites", { params: { limit: 100 } });
      const items: { photo?: Photo }[] = data?.items ?? [];
      setFavourites(
        items
          .filter((f) => f.photo)
          .map((f) => f.photo as Photo)
      );
    } catch {
      toast.error("Failed to load favourites");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      await loadFavourites();
    };
    void run();
  }, [loadFavourites]);

  const handleRemove = useCallback(
    async (photoId: string) => {
      try {
        await api.post("/favourites/toggle", { photo_id: photoId });
        setFavourites((prev) => prev.filter((p) => p.id !== photoId));
        toast.success("Removed from favourites");
      } catch {
        toast.error("Failed to update favourites");
      }
    },
    []
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Favourites</h1>
        <p className="text-muted-foreground mb-8">
          Your saved photographs
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : favourites.length === 0 ? (
          <div className="text-center">
            <EmptyState
              title="No favourites yet"
              description="Browse the gallery and save photographs you love"
              icon={<Heart className="h-8 w-8 text-muted-foreground" />}
            />
            <Link href="/gallery">
              <Button className="mt-4">Browse Gallery</Button>
            </Link>
          </div>
        ) : (
          <>
            <PhotoGrid
              photos={favourites}
              onFavourite={handleRemove}
              onOpenLightbox={(photo) => {
                const idx = favourites.findIndex((p) => p.id === photo.id);
                setLightboxIndex(idx >= 0 ? idx : 0);
              }}
            />
            {lightboxIndex !== null && (
              <PhotoLightbox
                photos={favourites}
                currentIndex={lightboxIndex}
                isOpen={lightboxIndex !== null}
                onClose={() => setLightboxIndex(null)}
                onNext={() =>
                  setLightboxIndex((prev) =>
                    prev !== null && prev < favourites.length - 1 ? prev + 1 : prev
                  )
                }
                onPrevious={() =>
                  setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
                }
              />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
}