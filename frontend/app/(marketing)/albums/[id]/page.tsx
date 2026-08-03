"use client";

import { use, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import { PhotoGrid, PhotoLightbox } from "@/components/gallery";
import { useAlbumDetail } from "@/hooks/useAlbums";

export default function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { album, photos, isLoading } = useAlbumDetail(id);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 bg-muted rounded-lg" />
          <div className="relative aspect-[21/9] bg-muted rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!album && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-3xl font-bold">Album Not Found</h1>
        <p className="text-muted-foreground">
          The album you are looking for does not exist or has been updated.
        </p>
        <Link
          href="/albums"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Albums
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Back link */}
        <Link
          href="/albums"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-amber-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Albums
        </Link>

        {/* Album Hero */}
        {album && (
          <div className="relative aspect-[21/9] overflow-hidden rounded-3xl bg-card border border-border/60 shadow-2xl glass-panel">
            {album.cover_photo_url ? (
              <ProtectedImage
                photo={{ preview_url: album.cover_photo_url }}
                alt={album.title}
                className="object-cover"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                <BookOpen className="h-16 w-16 text-amber-500/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 space-y-3">
              <div className="flex items-center gap-2">
                {album.is_featured && (
                  <Badge className="bg-amber-500 text-black font-bold">Featured Series</Badge>
                )}
                <Badge variant="secondary" className="bg-black/60 text-white border border-white/20 backdrop-blur-md">
                  <BookOpen className="h-3 w-3 mr-1 text-amber-400" />
                  {photos.length || album.photo_count || 0} Photos
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-bold text-white">
                {album.title}
              </h1>
              {album.description && (
                <p className="text-white/80 text-sm md:text-base max-w-2xl">
                  {album.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Photos grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <h2 className="font-heading font-bold text-2xl">Series Photographs</h2>
            <span className="text-xs text-muted-foreground font-mono">{photos.length} items</span>
          </div>
          <PhotoGrid
            photos={photos}
            onOpenLightbox={(photo) => {
              const idx = photos.findIndex((p) => p.id === photo.id);
              setLightboxIndex(idx >= 0 ? idx : 0);
            }}
          />
        </section>
      </motion.div>

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
    </div>
  );
}
