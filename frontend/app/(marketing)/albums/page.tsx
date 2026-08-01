"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BookOpen, Sparkles } from "lucide-react";
import { AlbumGrid } from "@/components/albums";
import { useAlbums } from "@/hooks/useAlbums";
import { Button } from "@/components/ui/button";

export default function AlbumsPage() {
  const [filter, setFilter] = useState<"all" | "featured">("all");
  const { data, isLoading, error } = useAlbums({ featured: filter === "featured" });

  const albums = data?.items || [];

  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center max-w-2xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-semibold border border-amber-500/30">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Curated Photo Collections</span>
        </div>
        <h1 className="font-heading font-bold text-4xl sm:text-5xl">
          Exhibition <span className="gold-gradient-text">Albums</span>
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Browse thematic series, travel logs, and fine art collections.
        </p>

        {/* Filter buttons */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            className={
              filter === "all"
                ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                : "border-border/60 hover:bg-muted"
            }
            onClick={() => setFilter("all")}
          >
            All Albums
          </Button>
          <Button
            variant={filter === "featured" ? "default" : "outline"}
            className={
              filter === "featured"
                ? "bg-amber-500 text-black font-bold shadow-md shadow-amber-500/20"
                : "border-border/60 hover:bg-muted"
            }
            onClick={() => setFilter("featured")}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            Featured Series
          </Button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] bg-muted/40 rounded-2xl animate-pulse border border-border/40"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-border/60 bg-muted/20">
          <p className="text-muted-foreground font-medium">{error}</p>
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl border border-dashed border-border/60 bg-muted/20">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No albums available right now.</p>
        </div>
      ) : (
        <AlbumGrid albums={albums} />
      )}
    </div>
  );
}
