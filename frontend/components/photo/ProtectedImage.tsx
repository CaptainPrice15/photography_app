"use client";

import { useEffect, useRef } from "react";
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
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    const blockDragStart = (e: DragEvent) => e.preventDefault();
    overlay.addEventListener("contextmenu", blockContextMenu);
    overlay.addEventListener("dragstart", blockDragStart);
    return () => {
      overlay.removeEventListener("contextmenu", blockContextMenu);
      overlay.removeEventListener("dragstart", blockDragStart);
    };
  }, []);

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden"
      style={{
        userSelect: "none",
        WebkitTouchCallout: "none",
      }}
    >
      <Image
        src={getPreviewUrl(photo)}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={className}
        priority={priority}
        quality={quality}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
      />
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 cursor-inherit"
        aria-hidden="true"
      />
    </div>
  );
}
