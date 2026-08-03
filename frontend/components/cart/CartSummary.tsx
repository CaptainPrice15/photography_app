"use client";

import { motion } from "motion/react";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  total: number;
  itemCount: number;
  onClose: () => void;
  onClear: () => void;
}

export function CartSummary({ total, itemCount, onClose, onClear }: CartSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Items ({itemCount})</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClear} className="flex-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
            <Link href="/checkout" className="flex-1" onClick={onClose}>
              <Button className="w-full" size="lg">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Shipping and taxes calculated at checkout
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}