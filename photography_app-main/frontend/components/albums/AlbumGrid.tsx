"use client";

import { motion } from "motion/react";
import { AlbumCard } from "./AlbumCard";

interface Album {
  id: string;
  title: string;
  description?: string;
  cover_photo_url?: string;
  photo_count: number;
  is_featured: boolean;
}

interface AlbumGridProps {
  albums: Album[];
}

export function AlbumGrid({ albums }: AlbumGridProps) {
  if (albums.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No albums found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {albums.map((album, index) => (
        <motion.div
          key={album.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <AlbumCard album={album} />
        </motion.div>
      ))}
    </div>
  );
}
