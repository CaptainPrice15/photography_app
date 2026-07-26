"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";

interface Photo {
  id: string;
  title: string;
  thumbnail_url: string;
}

interface RelatedPhotosProps {
  photos: Photo[];
}

export function RelatedPhotos({ photos }: RelatedPhotosProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium">Related Photos</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/gallery/${photo.id}`} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={photo.thumbnail_url}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
