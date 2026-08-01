"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Camera, Aperture, Sliders, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";

const GEAR_BRANDS = ["All", "Sony", "Canon", "Nikon", "Fujifilm", "Leica"];

const MOCK_GEAR_PHOTOS = [
  {
    id: "gear-1",
    title: "Urban Architecture Reflection",
    thumbnail_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop",
    original_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&auto=format&fit=crop",
    category: "Architecture",
    is_free: false,
    price: 35,
    camera_make: "Sony",
    camera_model: "A7IV",
    lens: "FE 24-70mm f/2.8 GM II",
    aperture: "2.8",
    shutter_speed: "1/500",
    iso: 100,
  },
  {
    id: "gear-2",
    title: "Mist Over Redwood Forest",
    thumbnail_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop",
    original_url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&auto=format&fit=crop",
    category: "Landscape",
    is_free: true,
    camera_make: "Canon",
    camera_model: "EOS R5",
    lens: "RF 70-200mm f/2.8L IS",
    aperture: "4.0",
    shutter_speed: "1/250",
    iso: 200,
  },
  {
    id: "gear-3",
    title: "Street Portrait Silhouette",
    thumbnail_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop",
    original_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1600&auto=format&fit=crop",
    category: "Portrait",
    is_free: false,
    price: 45,
    camera_make: "Leica",
    camera_model: "M11",
    lens: "Summilux-M 35mm f/1.4 ASPH",
    aperture: "1.4",
    shutter_speed: "1/1000",
    iso: 64,
  },
];

export default function GearPage() {
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredPhotos = selectedBrand === "All"
    ? MOCK_GEAR_PHOTOS
    : MOCK_GEAR_PHOTOS.filter((p) => p.camera_make === selectedBrand);

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
        {GEAR_BRANDS.map((brand) => (
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

      {/* Photo Grid */}
      <PhotoGrid
        photos={filteredPhotos}
        onOpenLightbox={(photo) => {
          const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
          setLightboxIndex(idx >= 0 ? idx : 0);
        }}
      />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : prev))}
          onPrevious={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
        />
      )}
    </div>
  );
}
