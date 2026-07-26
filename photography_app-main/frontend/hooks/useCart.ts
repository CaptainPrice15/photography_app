"use client";

import { useCallback } from "react";
import { useCartStore } from "@/store/cartStore";
import type { Photo } from "@/lib/types";

export function useCart() {
  const { items, addItem, removeItem, clearCart, getTotal, getItemCount, isInCart } = useCartStore();

  const addToCart = useCallback((photo: Photo) => {
    addItem(photo);
  }, [addItem]);

  const removeFromCart = useCallback((photoId: string) => {
    removeItem(photoId);
  }, [removeItem]);

  const inCart = useCallback((photoId: string) => {
    return isInCart(photoId);
  }, [isInCart]);

  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    total: getTotal(),
    itemCount: getItemCount(),
    inCart,
  };
}
