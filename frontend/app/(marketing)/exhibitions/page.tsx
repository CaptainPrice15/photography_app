"use client";

import { motion } from "motion/react";

export default function ExhibitionsPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="aspect-[16/9] bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
