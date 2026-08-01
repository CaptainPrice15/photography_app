"use client";

import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Maximize2,
  Minimize2,
  Sparkles,
  Camera,
  Aperture,
  Timer,
  Gauge,
  Calendar,
  MapPin,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExifHistogram } from "@/components/photo/ExifHistogram";
import { RoomPreviewModal } from "@/components/photo/RoomPreviewModal";
import { BeforeAfterSlider } from "@/components/photo/BeforeAfterSlider";

interface Photo {
  id: string;
  title: string;
  original_url: string;
  thumbnail_url?: string;
  camera_make?: string;
  camera_model?: string;
  lens?: string;
  focal_length?: string;
  aperture?: string;
  shutter_speed?: string;
  iso?: number;
  taken_at?: string;
  location_name?: string;
}

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function PhotoLightbox({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: PhotoLightboxProps) {
  const [showExif, setShowExif] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isRoomPreviewOpen, setIsRoomPreviewOpen] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const currentPhoto = photos[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowRight":
          onNext?.();
          break;
        case "ArrowLeft":
          onPrevious?.();
          break;
        case "i":
        case "I":
          setShowExif((prev) => !prev);
          break;
        case "z":
        case "Z":
          setIsZoomed((prev) => !prev);
          break;
      }
    },
    [isOpen, onClose, onNext, onPrevious]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!currentPhoto) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl select-none"
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-3">
                <span className="font-heading font-bold text-lg text-white">
                  {currentPhoto.title}
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-amber-400 border border-amber-500/30">
                  {currentIndex + 1} / {photos.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Before/After Toggle */}
                {currentPhoto.thumbnail_url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full text-xs font-medium border ${
                      showCompare
                        ? "bg-amber-500 text-black border-amber-400"
                        : "text-white border-white/20 hover:bg-white/10"
                    }`}
                    onClick={() => setShowCompare(!showCompare)}
                  >
                    <Sliders className="h-3.5 w-3.5 mr-1" />
                    Compare RAW
                  </Button>
                )}

                {/* Wall Preview Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-xs text-white border border-white/20 hover:bg-white/10"
                  onClick={() => setIsRoomPreviewOpen(true)}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-400" />
                  Room Preview
                </Button>

                {/* Zoom Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full"
                  onClick={() => setIsZoomed(!isZoomed)}
                  title="Toggle Zoom (Z)"
                >
                  {isZoomed ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>

                {/* EXIF Info Drawer Toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-full transition-colors ${
                    showExif ? "bg-amber-500 text-black" : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setShowExif(!showExif)}
                  title="Toggle EXIF Data (I)"
                >
                  <Info className="h-5 w-5" />
                </Button>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 rounded-full"
                  onClick={onClose}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Navigation Arrows */}
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-12 w-12 z-20"
                onClick={onPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {currentIndex < photos.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-12 w-12 z-20"
                onClick={onNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Main Canvas Viewport */}
            <div className="flex-1 flex items-center justify-center p-8 w-full h-full max-w-7xl">
              {showCompare && currentPhoto.thumbnail_url ? (
                <div className="w-full max-w-4xl">
                  <BeforeAfterSlider
                    beforeImage={currentPhoto.thumbnail_url}
                    afterImage={currentPhoto.original_url}
                    beforeLabel="RAW Original"
                    afterLabel="Final Color Grade"
                    alt={currentPhoto.title}
                  />
                </div>
              ) : (
                <motion.div
                  key={currentPhoto.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: isZoomed ? 1.4 : 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="relative max-w-[85vw] max-h-[85vh] w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={currentPhoto.original_url}
                    alt={currentPhoto.title}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority
                  />
                </motion.div>
              )}
            </div>

            {/* EXIF Data Drawer */}
            <AnimatePresence>
              {showExif && (
                <motion.aside
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "100%", opacity: 0 }}
                  transition={{ type: "spring", damping: 25, stiffness: 220 }}
                  className="absolute right-0 top-0 bottom-0 z-30 w-80 bg-zinc-950/90 border-l border-white/10 p-6 backdrop-blur-xl flex flex-col justify-between text-white overflow-y-auto"
                >
                  <div className="space-y-5 pt-12">
                    <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                      <Camera className="h-5 w-5 text-amber-400" />
                      <h3 className="font-heading font-bold text-lg">Camera Specs</h3>
                    </div>

                    {/* Camera Info */}
                    <div className="space-y-3 text-sm">
                      {(currentPhoto.camera_make || currentPhoto.camera_model) && (
                        <div>
                          <p className="text-xs text-white/50 uppercase tracking-wider">Camera</p>
                          <p className="font-semibold">{currentPhoto.camera_make} {currentPhoto.camera_model}</p>
                        </div>
                      )}

                      {currentPhoto.lens && (
                        <div>
                          <p className="text-xs text-white/50 uppercase tracking-wider">Lens</p>
                          <p className="font-medium text-amber-200">{currentPhoto.lens}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {currentPhoto.aperture && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <Aperture className="h-4 w-4 text-amber-400" />
                            <div>
                              <p className="text-[10px] text-white/50">Aperture</p>
                              <p className="font-mono text-xs font-bold">f/{currentPhoto.aperture}</p>
                            </div>
                          </div>
                        )}

                        {currentPhoto.shutter_speed && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <Timer className="h-4 w-4 text-amber-400" />
                            <div>
                              <p className="text-[10px] text-white/50">Shutter</p>
                              <p className="font-mono text-xs font-bold">{currentPhoto.shutter_speed}s</p>
                            </div>
                          </div>
                        )}

                        {currentPhoto.iso && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <Gauge className="h-4 w-4 text-amber-400" />
                            <div>
                              <p className="text-[10px] text-white/50">ISO</p>
                              <p className="font-mono text-xs font-bold">{currentPhoto.iso}</p>
                            </div>
                          </div>
                        )}

                        {currentPhoto.taken_at && (
                          <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                            <Calendar className="h-4 w-4 text-amber-400" />
                            <div>
                              <p className="text-[10px] text-white/50">Captured</p>
                              <p className="font-mono text-[11px]">
                                {new Date(currentPhoto.taken_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {currentPhoto.location_name && (
                        <div className="pt-2 flex items-center gap-2 text-xs text-amber-400">
                          <MapPin className="h-4 w-4" />
                          <span>{currentPhoto.location_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Exposure Histogram */}
                    <div className="pt-4">
                      <ExifHistogram
                        iso={currentPhoto.iso}
                        aperture={currentPhoto.aperture}
                        shutter_speed={currentPhoto.shutter_speed}
                      />
                    </div>
                  </div>

                  <div className="pt-4 text-center text-[10px] font-mono text-white/40 border-t border-white/10">
                    Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded">I</kbd> to hide specs
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wall Room Preview Modal */}
      {currentPhoto && (
        <RoomPreviewModal
          isOpen={isRoomPreviewOpen}
          onClose={() => setIsRoomPreviewOpen(false)}
          photoUrl={currentPhoto.original_url}
          photoTitle={currentPhoto.title}
        />
      )}
    </>
  );
}
