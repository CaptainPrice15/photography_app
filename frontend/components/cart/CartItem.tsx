"use client";

import { motion } from "motion/react";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import type { CartItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface CartItemProps {
  item: CartItem;
  index: number;
  onRemove: (photoId: string) => void;
}

export function CartItem({ item, index, onRemove }: CartItemProps) {
  const { photo } = item;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-muted rounded-lg flex-shrink-0 relative overflow-hidden">
              {photo.preview_url || photo.download_url ? (
                <ProtectedImage
                  photo={photo}
                  alt={photo.title}
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{photo.title}</h3>
              <p className="text-sm text-muted-foreground">
                {photo.camera_model || "Photograph"}
              </p>
              <p className="text-lg font-bold mt-2">
                {photo.is_free ? "Free" : formatCurrency(photo.price || 0)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(photo.id)}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}