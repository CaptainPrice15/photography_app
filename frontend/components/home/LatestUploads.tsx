"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Photo {
  id: string;
  title: string;
  thumbnail_url: string;
  created_at: string;
}

interface LatestUploadsProps {
  photos?: Photo[];
}

const MOCK_PHOTOS: Photo[] = [
  { id: "7", title: "Golden Hour", thumbnail_url: "/images/placeholder.jpg", created_at: "2026-07-24" },
  { id: "8", title: "Misty Mountains", thumbnail_url: "/images/placeholder.jpg", created_at: "2026-07-23" },
  { id: "9", title: "Coastal Sunset", thumbnail_url: "/images/placeholder.jpg", created_at: "2026-07-22" },
  { id: "10", title: "Autumn Leaves", thumbnail_url: "/images/placeholder.jpg", created_at: "2026-07-21" },
];

export function LatestUploads({ photos = MOCK_PHOTOS }: LatestUploadsProps) {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Latest Uploads</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recently added to the collection
            </p>
          </div>
          <Link
            href="/gallery?sort=newest"
            className="hidden sm:flex items-center gap-2 text-primary hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/gallery/${photo.id}`} className="group block">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={photo.thumbnail_url}
                    alt={photo.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium truncate">{photo.title}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/gallery?sort=newest" className="text-primary hover:underline">
            View all uploads →
          </Link>
        </div>
      </div>
    </section>
  );
}
