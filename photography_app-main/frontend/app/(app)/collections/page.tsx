"use client";

import { motion } from "motion/react";
import { FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Collections</h1>
        <p className="text-muted-foreground mb-8">
          Organize your favourite photographs into collections
        </p>

        <EmptyState
          title="No collections yet"
          description="Create collections to organize your favourite photographs"
          icon={<FolderOpen className="h-8 w-8 text-muted-foreground" />}
        />
      </motion.div>
    </div>
  );
}
