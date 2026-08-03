"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Monitor, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import { PhotoGrid, PhotoLightbox } from "@/components/gallery";
import type { PhotoItem } from "@/components/gallery/PhotoGrid";
import api from "@/lib/api";
import type { Exhibition, Photo } from "@/lib/types";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExhibitionDetailPage() {
  const params = useParams();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      try {
        const exhibitionRes = await api.get(`/exhibitions/${params.id}`);
        if (cancelled) return;
        setExhibition(exhibitionRes.data);

        const photosRes = await api.get("/photos", { params: { limit: 12 } });
        const items = (photosRes.data?.items ?? []) as Photo[];
        setPhotos(
          items.map((p: Photo) => ({
            id: p.id,
            title: p.title,
            preview_url: p.preview_url,
            download_url: p.download_url,
            is_free: p.is_free,
            price: p.price,
            view_count: p.view_count,
            location_name: p.location_name,
            camera_model: p.camera_model,
          }))
        );
      } catch {
        if (!cancelled) setExhibition(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
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

  if (!exhibition) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Exhibition Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The exhibition you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/exhibitions"
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Back to Exhibitions
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
          href="/exhibitions"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Exhibitions
        </Link>

        {/* Exhibition hero */}
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-muted">
          {exhibition.cover_image_url ? (
            <ProtectedImage
              photo={{ preview_url: exhibition.cover_image_url } as Photo}
              alt={exhibition.title}
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <Badge
              variant={exhibition.is_virtual ? "default" : "secondary"}
              className="mb-3"
            >
              {exhibition.is_virtual ? (
                <span className="flex items-center gap-1">
                  <Monitor className="h-3 w-3" />
                  Virtual Exhibition
                </span>
              ) : (
                "In-Person Exhibition"
              )}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {exhibition.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/80 text-sm mt-3">
              {exhibition.venue && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {exhibition.venue}
                  {exhibition.location && `, ${exhibition.location}`}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(exhibition.start_date)}
                {exhibition.end_date && ` - ${formatDate(exhibition.end_date)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Exhibition details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold">About the Exhibition</h2>
            <p className="text-muted-foreground leading-relaxed">
              {exhibition.long_description || exhibition.description}
            </p>
          </div>
          <div className="space-y-4">
            {exhibition.is_virtual && exhibition.exhibition_url && (
              <Link
                href={exhibition.exhibition_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
              >
                Join Virtual Exhibition
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            )}
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Exhibition Details</h3>
              <dl className="space-y-2 text-sm">
                {exhibition.venue && (
                  <div>
                    <dt className="text-muted-foreground">Venue</dt>
                    <dd className="font-medium">{exhibition.venue}</dd>
                  </div>
                )}
                {exhibition.location && (
                  <div>
                    <dt className="text-muted-foreground">Location</dt>
                    <dd className="font-medium">{exhibition.location}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground">Dates</dt>
                  <dd className="font-medium">
                    {formatDate(exhibition.start_date)} -{" "}
                    {exhibition.end_date ? formatDate(exhibition.end_date) : "Ongoing"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Photos grid */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Exhibition Photos</h2>
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