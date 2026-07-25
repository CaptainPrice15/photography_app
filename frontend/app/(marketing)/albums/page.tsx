"use client";

import { motion } from "motion/react";

export default function AlbumsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Albums</h1>
        <p className="text-muted-foreground mb-8">
          Explore curated collections of photographs
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="aspect-[4/3] bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
