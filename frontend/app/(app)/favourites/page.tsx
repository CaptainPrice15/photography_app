"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState } from "@/components/shared/EmptyState";

export default function FavouritesPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Favourites</h1>
        <p className="text-muted-foreground mb-8">
          Your saved photographs
        </p>

        <EmptyState
          title="No favourites yet"
          description="Browse the gallery and save photographs you love"
          icon={<Heart className="h-8 w-8 text-muted-foreground" />}
        />
      </motion.div>
    </div>
  );
}
