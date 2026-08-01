"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Navigation, Eye, Heart, Camera, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotoLightbox } from "@/components/gallery/PhotoLightbox";

export interface GeoPhoto {
  id: string;
  title: string;
  thumbnail_url: string;
  original_url: string;
  location_name: string;
  lat: number;
  lng: number;
  camera_model?: string;
  lens?: string;
}

// Sample world-class geo-tagged photo mock points
const MOCK_MAP_PHOTOS: GeoPhoto[] = [
  {
    id: "geo-1",
    title: "Golden Gate Dawn",
    thumbnail_url: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=800&auto=format&fit=crop",
    original_url: "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=1600&auto=format&fit=crop",
    location_name: "San Francisco, USA",
    lat: 37.8199,
    lng: -122.4783,
    camera_model: "Sony A7IV",
    lens: "FE 24-70mm f/2.8 GM II",
  },
  {
    id: "geo-2",
    title: "Alpine Mist Reflections",
    thumbnail_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop",
    original_url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop",
    location_name: "Swiss Alps, Switzerland",
    lat: 46.56,
    lng: 8.56,
    camera_model: "Canon EOS R5",
    lens: "RF 15-35mm f/2.8L",
  },
  {
    id: "geo-3",
    title: "Tokyo Cyber Neon",
    thumbnail_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop",
    original_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600&auto=format&fit=crop",
    location_name: "Shinjuku, Tokyo, Japan",
    lat: 35.6938,
    lng: 139.7034,
    camera_model: "Fujifilm X-T5",
    lens: "XF 35mm f/1.4 R",
  },
  {
    id: "geo-4",
    title: "Sahara Dunes at Sunset",
    thumbnail_url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop",
    original_url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1600&auto=format&fit=crop",
    location_name: "Merzouga, Morocco",
    lat: 31.099,
    lng: -4.01,
    camera_model: "Nikon Z8",
    lens: "NIKKOR Z 70-200mm f/2.8 S",
  },
  {
    id: "geo-5",
    title: "Reykjavik Northern Lights",
    thumbnail_url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&auto=format&fit=crop",
    original_url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600&auto=format&fit=crop",
    location_name: "Thingvellir, Iceland",
    lat: 64.2559,
    lng: -21.1297,
    camera_model: "Sony A1",
    lens: "FE 14mm f/1.8 GM",
  },
];

export function PhotoMap() {
  const [selectedPhoto, setSelectedPhoto] = useState<GeoPhoto | null>(MOCK_MAP_PHOTOS[0]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
              {MOCK_MAP_PHOTOS.length} Pinned Shoots
            </Badge>
          </div>

          {/* Map Pin Nodes */}
          <div className="relative flex-1 my-6 flex items-center justify-around flex-wrap gap-6 z-10">
            {MOCK_MAP_PHOTOS.map((photo, index) => {
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
                <Image
                  src={selectedPhoto.thumbnail_url}
                  alt={selectedPhoto.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                <Button
                  size="icon"
                  className="absolute bottom-3 right-3 rounded-full bg-amber-500 text-black hover:bg-amber-400 shadow-lg"
                  onClick={() => {
                    const idx = MOCK_MAP_PHOTOS.findIndex((p) => p.id === selectedPhoto.id);
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

            <div className="pt-4 border-t border-border/60">
              <Button
                onClick={() => {
                  const idx = MOCK_MAP_PHOTOS.findIndex((p) => p.id === selectedPhoto.id);
                  setLightboxIndex(idx >= 0 ? idx : 0);
                }}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-md shadow-amber-500/20"
              >
                View Full Screen Shoot
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox for Map photos */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={MOCK_MAP_PHOTOS}
          currentIndex={lightboxIndex}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNext={() => setLightboxIndex((prev) => (prev !== null && prev < MOCK_MAP_PHOTOS.length - 1 ? prev + 1 : prev))}
          onPrevious={() => setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev))}
        />
      )}
    </div>
  );
}
