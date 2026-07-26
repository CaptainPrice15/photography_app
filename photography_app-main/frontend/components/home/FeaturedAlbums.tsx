"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Album {
  id: string;
  title: string;
  description?: string;
  cover_photo_url?: string;
  photo_count: number;
  is_featured: boolean;
}

interface FeaturedAlbumsProps {
  albums?: Album[];
}

const MOCK_ALBUMS: Album[] = [
  { id: "1", title: "Japanese Temples", description: "Ancient temples and shrines across Japan", cover_photo_url: "/images/placeholder.jpg", photo_count: 24, is_featured: true },
  { id: "2", title: "Nordic Landscapes", description: "Fjords and mountains of Scandinavia", cover_photo_url: "/images/placeholder.jpg", photo_count: 18, is_featured: true },
  { id: "3", title: "Street Photography", description: "Candid moments from city streets", cover_photo_url: "/images/placeholder.jpg", photo_count: 32, is_featured: false },
];

export function FeaturedAlbums({ albums = MOCK_ALBUMS }: FeaturedAlbumsProps) {
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
            <h2 className="text-3xl font-bold mb-2">Featured Albums</h2>
            <p className="text-muted-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Curated photo collections
            </p>
          </div>
          <Link
            href="/albums"
            className="hidden sm:flex items-center gap-2 text-primary hover:underline"
          >
            View all albums <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/albums/${album.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                  {album.cover_photo_url ? (
                    <Image
                      src={album.cover_photo_url}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
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
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link href="/albums" className="text-primary hover:underline">
            View all albums →
          </Link>
        </div>
      </div>
    </section>
  );
}
