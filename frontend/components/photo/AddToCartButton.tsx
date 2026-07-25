"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  photoId: string;
  price: number;
  onAddToCart?: (photoId: string) => void;
}

export function AddToCartButton({
  photoId,
  price,
  onAddToCart,
}: AddToCartButtonProps) {
  return (
    <Button
      size="lg"
      onClick={() => onAddToCart?.(photoId)}
      className="bg-green-600 hover:bg-green-700"
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      Add to Cart - ${price}
    </Button>
  );
}
