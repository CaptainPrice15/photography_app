"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import api from "@/lib/api";

interface RenderPhoto {
  id: string;
  src: string;
  title: string;
  collectionId: string;
  featured: boolean;
}

interface FeaturedPhotosProps {
  photos?: RenderPhoto[];
}

export function FeaturedPhotos({ photos: propPhotos }: FeaturedPhotosProps) {
  const [photos, setPhotos] = useState<RenderPhoto[]>(propPhotos || []);

  useEffect(() => {
    if (propPhotos) return;
    api.get("/photos/featured").then(({ data }) => {
      const items = Array.isArray(data) ? data : [];
      setPhotos(items);
    }).catch(() => {});
  }, [propPhotos]);
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Featured Photography</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Handpicked selections showcasing the best of the collection
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/gallery/${photo.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                  <ProtectedImage
                    photo={{ src: photo.src }}
                    alt={photo.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Eye className="h-10 w-10 text-white" />
                  </div>
                  {photo.collectionId && (
                    <Badge className="absolute top-3 left-3" variant="secondary">
                      {photo.collectionId}
                    </Badge>
                  )}
                </div>
                <h3 className="mt-3 font-medium group-hover:text-primary transition-colors">
                  {photo.title}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/gallery"
            className={cn(
              "inline-flex items-center justify-center rounded-lg border border-transparent bg-transparent px-4 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline transition-colors",
              "h-9 gap-1.5 px-2.5"
            )}
          >
            View All Photos
          </Link>
        </div>
      </div>
    </section>
  );
}
