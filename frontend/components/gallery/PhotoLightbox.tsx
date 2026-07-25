"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  title: string;
  original_url: string;
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

  return (
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:text-white/80 z-10"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation */}
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 z-10"
              onClick={onPrevious}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {currentIndex < photos.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 z-10"
              onClick={onNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* Image */}
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
          >
            <Image
              src={currentPhoto.original_url}
              alt={currentPhoto.title}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </motion.div>

          {/* Caption */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
            <p className="text-white font-medium">{currentPhoto.title}</p>
            <p className="text-white/60 text-sm mt-1">
              {currentIndex + 1} / {photos.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
