"use client";

import { motion } from "motion/react";
import { PhotoCard } from "./PhotoCard";

interface Photo {
  id: string;
  title: string;
  slug?: string;
  thumbnail_url: string;
  category?: string;
  is_free: boolean;
  price?: number;
  view_count?: number;
}

interface PhotoGridProps {
  photos: Photo[];
  columns?: 2 | 3 | 4;
  onFavourite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export function PhotoGrid({
  photos,
  columns = 3,
  onFavourite,
  onAddToCart,
}: PhotoGridProps) {
  const columnClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No photos found</p>
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
          transition={{ delay: index * 0.05, duration: 0.4 }}
        >
          <PhotoCard
            photo={photo}
            onFavourite={onFavourite}
            onAddToCart={onAddToCart}
          />
        </motion.div>
      ))}
    </div>
  );
}
