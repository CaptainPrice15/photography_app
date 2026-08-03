"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import { useAlbums } from "@/hooks/useAlbums";

export function FeaturedAlbums() {
  const { data, isLoading } = useAlbums({ featured: true, limit: 3 });
  const albums = data?.items || [];

  if (!isLoading && albums.length === 0) return null;

  return (
    <section className="py-20 px-4 bg-muted/20 border-y border-border/40">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/30 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Collections</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl">Featured Albums</h2>
          </div>
          <Link
            href="/albums"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-amber-500 hover:underline"
          >
            View all albums <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-muted/40 animate-pulse border border-border/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {albums.slice(0, 3).map((album, index) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/albums/${album.id}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card border border-border/60 shadow-lg group-hover:shadow-2xl transition-all duration-500 glass-panel">
                    {album.cover_photo_url ? (
                      <ProtectedImage
                        photo={{ preview_url: album.cover_photo_url }}
                        alt={album.title}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                        <BookOpen className="h-12 w-12 text-amber-500/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-heading font-bold text-xl group-hover:text-amber-400 transition-colors">
                          {album.title}
                        </h3>
                        {album.is_featured && (
                          <Badge className="bg-amber-500 text-black text-[10px] font-bold">Featured</Badge>
                        )}
                      </div>
                      {album.description && (
                        <p className="text-white/70 text-xs line-clamp-2">{album.description}</p>
                      )}
                      <p className="text-amber-400/90 text-xs font-mono font-medium pt-1">
                        {album.photo_count || 0} photographs
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link href="/albums" className="text-amber-500 font-semibold hover:underline text-sm">
            View all albums →
          </Link>
        </div>
      </div>
    </section>
  );
}
