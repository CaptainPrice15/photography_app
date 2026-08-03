"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/photo/ProtectedImage";

interface Album {
  id: string;
  title: string;
  description?: string;
  cover_photo_url?: string;
  photo_count: number;
  is_featured: boolean;
}

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <Link href={`/albums/${album.id}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
        {album.cover_photo_url ? (
          <ProtectedImage
            photo={{ preview_url: album.cover_photo_url }}
            alt={album.title}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold">{album.title}</h3>
            {album.is_featured && (
              <Badge className="bg-yellow-600 text-xs">Featured</Badge>
            )}
          </div>
          {album.description && (
            <p className="text-white/70 text-sm line-clamp-2 mb-2">{album.description}</p>
          )}
          <p className="text-white/60 text-xs">{album.photo_count} photos</p>
        </div>
      </div>
    </Link>
  );
}
