"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";

export function OrderSummary() {
  const { items, total, itemCount } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="truncate flex-1 mr-2">{item.photo.title}</span>
                <span>{item.photo.is_free ? "Free" : formatCurrency(item.photo.price || 0)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>Subtotal ({itemCount} items)</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}