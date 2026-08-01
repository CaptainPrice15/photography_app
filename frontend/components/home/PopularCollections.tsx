"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";
import api from "@/lib/api";

interface Collection {
  id: string;
  name: string;
  photo_count: number;
  cover_url?: string;
}

interface PopularCollectionsProps {
  collections?: Collection[];
}

export function PopularCollections({ collections: propCollections }: PopularCollectionsProps) {
  const [collections, setCollections] = useState<Collection[]>(propCollections || []);

  useEffect(() => {
    if (propCollections) return;
    api.get("/photos/collections").then(({ data }) => {
      const items = Array.isArray(data) ? data : data.items || [];
      setCollections(items.map((c: any) => ({
        id: c.id || c.slug,
        name: c.title || c.name || c.slug,
        photo_count: c.photos?.length || 0,
        cover_url: c.cover || c.cover_url || "/images/placeholder.jpg",
      })));
    }).catch(() => {});
  }, [propCollections]);
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Popular Collections</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore themed collections of photographs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/albums/${collection.id}`} className="group block">
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg bg-muted">
                  {collection.cover_url ? (
                    <Image
                      src={collection.cover_url}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Folder className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{collection.name}</h3>
                    <p className="text-white/70 text-sm">{collection.photo_count} photos</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/albums"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            View all collections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
