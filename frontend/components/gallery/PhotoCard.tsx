"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingCart, Sparkles, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RoomPreviewModal } from "@/components/photo/RoomPreviewModal";
import { formatCurrency } from "@/lib/utils";
import type { Photo } from "@/lib/types";

interface PhotoCardProps {
  photo: Photo;
  onFavourite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onOpenLightbox?: (photo: Photo) => void;
}

export function PhotoCard({ photo, onFavourite, onAddToCart, onOpenLightbox }: PhotoCardProps) {
  const [isRoomPreviewOpen, setIsRoomPreviewOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const displayPrice = photo.price ?? 25;
  const imageSrc = photo.thumbnail_url || photo.original_url || "/images/placeholder.jpg";

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex flex-col rounded-2xl overflow-hidden bg-card border border-border/50 shadow-md hover:shadow-2xl hover:border-amber-500/40 transition-all duration-300 glass-panel"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/40">
          <Image
            src={imageSrc}
            alt={photo.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-108"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Actions Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button
              size="icon"
              variant="secondary"
              className={`h-10 w-10 rounded-full shadow-lg backdrop-blur-md transition-transform hover:scale-110 ${
                isLiked ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-black/70 text-white hover:bg-amber-500 hover:text-black"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLiked(!isLiked);
                onFavourite?.(photo.id);
              }}
              title="Add to Favourites"
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-black/70 text-white hover:bg-amber-500 hover:text-black shadow-lg backdrop-blur-md transition-transform hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onOpenLightbox) {
                  onOpenLightbox(photo);
                }
              }}
              title="Full-Screen Lightbox"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-black/70 text-white hover:bg-amber-500 hover:text-black shadow-lg backdrop-blur-md transition-transform hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsRoomPreviewOpen(true);
              }}
              title="Preview on Living Room Wall"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
            </Button>

            {!photo.is_free && (
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-amber-500 text-black hover:bg-amber-400 shadow-lg backdrop-blur-md transition-transform hover:scale-110 font-bold"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAddToCart?.(photo.id);
                }}
                title="Add to Cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            {photo.category_id && (
              <Badge className="text-[10px] font-semibold tracking-wider uppercase bg-black/60 text-white border border-white/20 backdrop-blur-md">
                {photo.category_id}
              </Badge>
            )}
          </div>

          {/* Price Tag */}
          <div className="absolute top-3 right-3 z-10">
            {photo.is_free ? (
              <Badge className="bg-emerald-500/90 text-white text-[10px] font-bold uppercase backdrop-blur-md border border-emerald-400/30">
                Free
              </Badge>
            ) : (
              <Badge className="bg-amber-500 text-black text-[11px] font-bold backdrop-blur-md shadow-md">
                {formatCurrency(displayPrice)}
              </Badge>
            )}
          </div>
        </div>

        {/* Content Info */}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div>
            <Link href={`/gallery/${photo.id}`}>
              <h3 className="font-heading font-semibold text-lg line-clamp-1 group-hover:text-amber-500 transition-colors">
                {photo.title}
              </h3>
            </Link>
            {photo.location_name && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-amber-500/80" />
                <span className="line-clamp-1">{photo.location_name}</span>
              </p>
            )}
          </div>

          {photo.view_count !== undefined && (
            <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
              <span>{photo.view_count.toLocaleString()} views</span>
              <span className="text-amber-500 text-[11px] font-medium group-hover:underline">Explore →</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Wall Room Preview Modal */}
      <RoomPreviewModal
        isOpen={isRoomPreviewOpen}
        onClose={() => setIsRoomPreviewOpen(false)}
        photoUrl={photo.original_url || imageSrc}
        photoTitle={photo.title}
      />
    </>
  );
}
