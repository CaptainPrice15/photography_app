"use client";

import { motion } from "motion/react";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/EmptyState";

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground mb-8">View your past purchases</p>

        <EmptyState
          title="No orders yet"
          description="Your purchased photographs will appear here"
          icon={<Package className="h-8 w-8 text-muted-foreground" />}
        />
      </motion.div>
    </div>
  );
}
