"use client";

import Image from "next/image";
import { getPreviewUrl } from "@/lib/imageUrl";
import type { Photo } from "@/lib/types";

interface ProtectedImageProps {
  photo: Photo | { preview_url?: string; download_url?: string } | null;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
}

export function ProtectedImage({
  photo,
  alt,
  fill = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className,
  priority,
  quality,
}: ProtectedImageProps) {
  return (
    <Image
      src={getPreviewUrl(photo)}
      alt={alt}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      quality={quality}
    />
  );
}
