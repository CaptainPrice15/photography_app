"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CartPage() {
  const { items, removeFromCart, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          title="Your cart is empty"
          description="Browse the gallery and add some photographs to your cart"
        />
        <div className="flex justify-center mt-4">
          <Link href="/gallery">
            <Button>Browse Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.photo.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.photo.camera_model || "Photograph"}
                      </p>
                      <p className="text-lg font-bold mt-2">
                        {item.photo.is_free ? "Free" : formatCurrency(item.photo.price || 0)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.photo.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
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
                <Link href="/checkout" className="block">
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
