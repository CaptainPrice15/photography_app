"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  title: string;
  slug?: string;
  thumbnail_url: string;
  category?: string;
  is_free: boolean;
  price?: number;
  view_count?: number;
}

interface PhotoCardProps {
  photo: Photo;
  onFavourite?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export function PhotoCard({ photo, onFavourite, onAddToCart }: PhotoCardProps) {
  return (
    <div className="group relative">
      <Link href={`/gallery/${photo.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
          <Image
            src={photo.thumbnail_url}
            alt={photo.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />

          {/* Quick actions overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                onFavourite?.(photo.id);
              }}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
            >
              <Eye className="h-5 w-5" />
            </Button>
            {!photo.is_free && photo.price && (
              <Button
                size="icon"
                variant="secondary"
                className="h-10 w-10 rounded-full bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart?.(photo.id);
                }}
              >
                <ShoppingCart className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {photo.category && (
              <Badge variant="secondary" className="text-xs">
                {photo.category}
              </Badge>
            )}
          </div>

          {!photo.is_free && photo.price && (
            <Badge className="absolute top-3 right-3 bg-green-600 text-xs">
              ${photo.price}
            </Badge>
          )}
        </div>
      </Link>

      <div className="mt-3">
        <Link href={`/gallery/${photo.id}`}>
          <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
            {photo.title}
          </h3>
        </Link>
        {photo.view_count !== undefined && (
          <p className="text-sm text-muted-foreground mt-1">
            {photo.view_count.toLocaleString()} views
          </p>
        )}
      </div>
    </div>
  );
}
