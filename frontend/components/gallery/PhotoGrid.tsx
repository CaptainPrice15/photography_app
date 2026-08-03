"use client";

import { motion } from "motion/react";
import { PhotoCard } from "./PhotoCard";
import type { Photo } from "@/lib/types";

export type PhotoItem = Partial<Photo> & {
  id: string;
  title: string;
  preview_url?: string;
  download_url?: string;
  is_free?: boolean;
  price?: number;
};

interface PhotoGridProps {
  photos: PhotoItem[];
  columns?: 2 | 3 | 4;
  onFavourite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onOpenLightbox?: (photo: PhotoItem) => void;
}

export function PhotoGrid({
  photos,
  columns = 3,
  onFavourite,
  onAddToCart,
  onOpenLightbox,
}: PhotoGridProps) {
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-border/60 bg-muted/20">
        <p className="text-muted-foreground font-medium">No photography items match this selection.</p>
      </div>
    );
  }

  return (
    <div className={`grid ${columnClasses[columns]} gap-6`}>
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.3 }}
        >
          <PhotoCard
            photo={photo}
            onFavourite={onFavourite}
            onAddToCart={onAddToCart}
            onOpenLightbox={onOpenLightbox}
          />
        </motion.div>
      ))}
    </div>
  );
}
