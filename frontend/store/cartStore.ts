"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Photo } from "@/lib/types";

interface CartState {
  items: CartItem[];
  addItem: (photo: Photo) => void;
  removeItem: (photoId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (photoId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (photo) => {
        const { items } = get();
        if (!items.find((item) => item.photo.id === photo.id)) {
          const newItem: CartItem = {
            id: `cart-${photo.id}`,
            photo,
            added_at: new Date().toISOString(),
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (photoId) => {
        set({ items: get().items.filter((item) => item.photo.id !== photoId) });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((sum, item) => sum + (item.photo.price || 0), 0);
      },

      getItemCount: () => get().items.length,

      isInCart: (photoId) => {
        return get().items.some((item) => item.photo.id === photoId);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
