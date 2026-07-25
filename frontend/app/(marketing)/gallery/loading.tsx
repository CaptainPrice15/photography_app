"use client";

import { motion } from "motion/react";

export default function GalleryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="h-10 w-32 bg-muted rounded animate-pulse mb-2" />
        <div className="h-5 w-64 bg-muted rounded animate-pulse" />
      </div>

      <div className="mb-8">
        <div className="h-12 bg-muted rounded animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="aspect-[4/3] bg-muted rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
