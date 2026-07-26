"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlbumGrid } from "@/components/albums";

interface Album {
  id: string;
  title: string;
  description?: string;
  cover_photo_url?: string;
  photo_count: number;
  is_featured: boolean;
}

const MOCK_ALBUMS: Album[] = [
  { id: "1", title: "Japanese Temples", description: "Ancient temples and shrines across Japan", cover_photo_url: "/images/placeholder.jpg", photo_count: 24, is_featured: true },
  { id: "2", title: "Nordic Landscapes", description: "Fjords and mountains of Scandinavia", cover_photo_url: "/images/placeholder.jpg", photo_count: 18, is_featured: true },
  { id: "3", title: "Street Photography", description: "Candid moments from city streets", cover_photo_url: "/images/placeholder.jpg", photo_count: 32, is_featured: false },
  { id: "4", title: "Portrait Series", description: "Studio and environmental portraits", cover_photo_url: "/images/placeholder.jpg", photo_count: 21, is_featured: false },
  { id: "5", title: "Ocean Life", description: "Marine photography from around the world", cover_photo_url: "/images/placeholder.jpg", photo_count: 15, is_featured: true },
  { id: "6", title: "Architectural Wonders", description: "Modern and historic architecture", cover_photo_url: "/images/placeholder.jpg", photo_count: 27, is_featured: false },
];

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAlbums(MOCK_ALBUMS);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Albums</h1>
        <p className="text-muted-foreground mb-8">
          Explore curated collections of photographs
        </p>

        {/* Sort tabs */}
        <div className="flex gap-2 mb-8">
          <button className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg">
            All Albums
          </button>
          <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            Featured
          </button>
          <button className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            Newest
          </button>
        </div>

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
          <AlbumGrid albums={albums} />
        )}
      </motion.div>
    </div>
  );
}
