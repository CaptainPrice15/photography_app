"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { CartItem } from "./CartItem";

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeFromCart, clearCart, total, itemCount } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Sidebar */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl flex flex-col glass-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-amber-500/10 text-amber-500">
                  <ShoppingCart className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-xl font-semibold">Your Cart</h2>
                <span className="text-xs bg-amber-500/20 text-amber-500 font-medium px-2 py-0.5 rounded-full">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart Items list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="p-4 rounded-full bg-muted/50 mb-4">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-6">
                    Explore our fine art collection and select digital downloads or prints.
                  </p>
                  <Button onClick={onClose} variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                    Browse Gallery
                  </Button>
                </div>
              ) : (
                items.map((item, index) => (
                  <CartItem key={item.id} item={item} index={index} onRemove={removeFromCart} />
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border/60 bg-muted/20 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-base font-mono">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>License & Delivery</span>
                  <span className="text-green-500 font-medium">Instant Digital Access</span>
                </div>

                <Separator className="bg-border/60" />

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearCart} className="text-xs text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Clear
                  </Button>
                  <Link href="/checkout" onClick={onClose} className="flex-1">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-lg shadow-amber-500/20">
                      Checkout ({formatCurrency(total)})
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}