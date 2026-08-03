"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { MapPin, Navigation, Eye, Camera, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";
import api from "@/lib/api";
import type { Photo } from "@/lib/types";

export interface GeoPhoto {
  id: string;
  title: string;
  preview_url?: string;
  download_url?: string;
  location_name: string;
  lat: number;
  lng: number;
  camera_model?: string;
  lens?: string;
}

export function PhotoMap() {
  const [geoPhotos, setGeoPhotos] = useState<GeoPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<GeoPhoto | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await api.get("/photos", { params: { limit: 100, sort: "newest" } });
        if (cancelled) return;
        const items: Photo[] = data?.items ?? [];
        const located = items
          .filter((p) => typeof p.latitude === "number" && typeof p.longitude === "number")
          .map((p) => ({
            id: p.id,
            title: p.title,
            preview_url: p.preview_url,
            download_url: p.download_url,
            location_name: p.location_name || "Unknown Location",
            lat: p.latitude as number,
            lng: p.longitude as number,
            camera_model: p.camera_model,
            lens: p.lens,
          }));
        setGeoPhotos(located);
        if (located.length > 0) setSelectedPhoto(located[0]);
      } catch {
        setGeoPhotos([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center bg-zinc-950 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-zinc-950 overflow-hidden flex flex-col md:flex-row">
      {/* Interactive Map Visualizer Surface */}
      <div className="flex-1 relative w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black flex items-center justify-center p-6">
        {/* World Grid Lines Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        <div className="relative w-full max-w-4xl h-[480px] rounded-3xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden p-6 flex flex-col justify-between">
          {/* Header Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg text-white">Global Geo-Gallery</h2>
                <p className="text-xs text-muted-foreground">Click map pins to explore location shoots</p>
              </div>
            </div>
            <Badge className="bg-amber-500 text-black font-bold">
              {geoPhotos.length} Pinned Shoots
            </Badge>
          </div>

          {/* Map Pin Nodes */}
          {geoPhotos.length > 0 ? (
            <div className="relative flex-1 my-6 flex items-center justify-around flex-wrap gap-6 z-10">
              {geoPhotos.map((photo) => {
                const isSelected = selectedPhoto?.id === photo.id;
                return (
                  <motion.button
                    key={photo.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPhoto(photo)}
                    className={`relative flex items-center gap-2 p-2 rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? "bg-amber-500 text-black border-amber-400 font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                        : "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md"
                    }`}
                  >
                    <MapPin className={`h-4 w-4 ${isSelected ? "text-black" : "text-amber-400"}`} />
                    <span className="text-xs">{photo.location_name.split(",")[0]}</span>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 z-10 text-center">
              <MapPin className="h-10 w-10 text-amber-500/40" />
              <p className="text-sm text-muted-foreground max-w-sm">
                No geo-tagged photographs available yet. Photos with location coordinates will appear here.
              </p>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1 text-sm text-amber-400 hover:underline"
              >
                Browse the gallery →
              </Link>
            </div>
          )}

          {/* Map Compass Rose Background Accent */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Navigation className="h-80 w-80 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Selected Location Card Sidebar */}
      <AnimatePresence mode="wait">
        {selectedPhoto && (
          <motion.div
            key={selectedPhoto.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full md:w-96 p-6 glass-panel border-t md:border-t-0 md:border-l border-border/60 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border/60 shadow-xl mb-4 group">
                <ProtectedImage
                  photo={{ preview_url: selectedPhoto.preview_url, download_url: selectedPhoto.download_url }}
                  alt={selectedPhoto.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 384px"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 rounded-full bg-amber-500 text-black hover:bg-amber-400 shadow-lg"
                  onClick={() => {
                    const idx = geoPhotos.findIndex((p) => p.id === selectedPhoto.id);
                    setLightboxIndex(idx >= 0 ? idx : 0);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Badge className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs">
                  {selectedPhoto.location_name}
                </Badge>
                <h3 className="font-heading font-bold text-2xl">{selectedPhoto.title}</h3>

                {selectedPhoto.camera_model && (
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/40 text-xs space-y-1">
                    <p className="flex items-center gap-1.5 text-muted-foreground">
                      <Camera className="h-3.5 w-3.5 text-amber-500" />
                      <span>{selectedPhoto.camera_model}</span>
                    </p>
                    {selectedPhoto.lens && (
                      <p className="font-mono text-amber-500 font-semibold">{selectedPhoto.lens}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 space-y-2">
              <Button
                onClick={() => {
                  const idx = geoPhotos.findIndex((p) => p.id === selectedPhoto.id);
                  setLightboxIndex(idx >= 0 ? idx : 0);
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-md shadow-amber-500/20"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Screen Shoot
              </Button>
              <Link
                href={`/gallery/${selectedPhoto.id}`}
                className="block text-center text-sm text-muted-foreground hover:text-amber-500"
              >
                Open photo detail page →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for Map photos */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={geoPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNext={() =>
            setLightboxIndex((prev) => (prev !== null && prev < geoPhotos.length - 1 ? prev + 1 : prev))
          }
          onPrevious={() =>
            setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))
          }
        />
      )}
    </div>
  );
}