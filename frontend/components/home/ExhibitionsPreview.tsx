"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import api from "@/lib/api";
import type { Exhibition, Photo } from "@/lib/types";

interface ExhibitionsPreviewProps {
  exhibitions?: Exhibition[];
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ExhibitionsPreview({ exhibitions: propExhibitions }: ExhibitionsPreviewProps) {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>(propExhibitions || []);

  useEffect(() => {
    if (propExhibitions) return;
    let cancelled = false;
    api.get("/exhibitions", { params: { limit: 2 } })
      .then(({ data }) => {
        if (cancelled) return;
        setExhibitions(Array.isArray(data) ? data : data?.items ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [propExhibitions]);

  if (exhibitions.length === 0) return null;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">Exhibitions</h2>
            <p className="text-muted-foreground">Current and upcoming photography exhibitions</p>
          </div>
          <Link
            href="/exhibitions"
            className="hidden sm:flex items-center gap-2 text-primary hover:underline"
          >
            View all exhibitions <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exhibitions.map((exhibition, index) => (
            <motion.div
              key={exhibition.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/exhibitions/${exhibition.id}`} className="group block">
                <div className="relative aspect-[16/7] overflow-hidden rounded-lg bg-muted">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={exhibition.is_virtual ? "default" : "secondary"}>
                        {exhibition.is_virtual ? "Virtual" : "In-Person"}
                      </Badge>
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">{exhibition.title}</h3>
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
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 sm:hidden">
          <Link href="/exhibitions" className="text-primary hover:underline">
            View all exhibitions →
          </Link>
        </div>
      </div>
    </section>
  );
}