"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import api from "@/lib/api";
import type { Exhibition, Photo } from "@/lib/types";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await api.get("/exhibitions", { params: { limit: 20 } });
        if (cancelled) return;
        setExhibitions(Array.isArray(data) ? data : data?.items ?? []);
      } catch {
        if (!cancelled) setExhibitions([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Exhibitions</h1>
        <p className="text-muted-foreground mb-8">
          View current and upcoming photography exhibitions
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[16/9] bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/exhibitions/${exhibition.id}`} className="group block">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                    {exhibition.cover_image_url ? (
                      <ProtectedImage
                        photo={{ preview_url: exhibition.cover_image_url } as Photo}
                        alt={exhibition.title}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={exhibition.is_virtual ? "default" : "secondary"}>
                          {exhibition.is_virtual ? (
                            <span className="flex items-center gap-1">
                              <Monitor className="h-3 w-3" />
                              Virtual
                            </span>
                          ) : (
                            "In-Person"
                          )}
                        </Badge>
                      </div>
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:underline">
                        {exhibition.title}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-2 mb-3">
                        {exhibition.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                        {exhibition.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {exhibition.venue}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(exhibition.start_date)}
                          {exhibition.end_date && ` - ${formatDate(exhibition.end_date)}`}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        View exhibition <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && exhibitions.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No exhibitions are currently available.
          </div>
        )}
      </motion.div>
    </div>
  );
}