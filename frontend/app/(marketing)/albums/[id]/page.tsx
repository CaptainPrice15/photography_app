"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PhotoGrid } from "@/components/gallery";

interface Album {
  id: string;
  title: string;
  description?: string;
  cover_photo_url?: string;
  photo_count: number;
  is_featured: boolean;
}

interface Photo {
  id: string;
  title: string;
  thumbnail_url: string;
  category?: string;
  is_free: boolean;
  price?: number;
  view_count?: number;
}

const MOCK_ALBUM: Album = {
  id: "1",
  title: "Japanese Temples",
  description: "Ancient temples and shrines across Japan, captured during golden hour and blue hour. This collection showcases traditional Japanese architecture and its relationship with nature.",
  cover_photo_url: "/images/placeholder.jpg",
  photo_count: 24,
  is_featured: true,
};

const MOCK_PHOTOS: Photo[] = [
  { id: "1", title: "Mountain Sunrise", thumbnail_url: "/images/placeholder.jpg", category: "Landscapes", is_free: false, price: 49.99, view_count: 1250 },
  { id: "2", title: "Urban Street", thumbnail_url: "/images/placeholder.jpg", category: "Street", is_free: true, view_count: 890 },
  { id: "3", title: "Portrait Study", thumbnail_url: "/images/placeholder.jpg", category: "Portraits", is_free: false, price: 39.99, view_count: 2100 },
  { id: "4", title: "Ocean Waves", thumbnail_url: "/images/placeholder.jpg", category: "Nature", is_free: false, price: 59.99, view_count: 1560 },
  { id: "5", title: "City Lights", thumbnail_url: "/images/placeholder.jpg", category: "Street", is_free: true, view_count: 780 },
  { id: "6", title: "Forest Path", thumbnail_url: "/images/placeholder.jpg", category: "Nature", is_free: false, price: 44.99, view_count: 1890 },
];

export default function AlbumDetailPage() {
  const params = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAlbum(MOCK_ALBUM);
      setPhotos(MOCK_PHOTOS);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="relative aspect-[21/9] bg-muted rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Album Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The album you're looking for doesn't exist or has been removed.
        </p>
        <Link
          href="/albums"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Back to Albums
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Back link */}
        <Link
          href="/albums"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Albums
        </Link>

        {/* Album hero */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-muted">
          {album.cover_photo_url ? (
            <Image
              src={album.cover_photo_url}
              alt={album.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-muted-foreground/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="flex items-center gap-2 mb-3">
              {album.is_featured && <Badge className="bg-yellow-600">Featured</Badge>}
              <Badge variant="secondary" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {album.photo_count} photos
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {album.title}
            </h1>
            {album.description && (
              <p className="text-white/80 text-lg max-w-2xl">
                {album.description}
              </p>
            )}
          </div>
        </div>

        {/* Photos grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Photos in this Album</h2>
          <PhotoGrid photos={photos} />
        </section>
      </motion.div>
    </div>
  );
}
