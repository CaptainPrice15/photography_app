"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FavouriteButtonProps {
  photoId: string;
  isFavourited?: boolean;
  onToggle?: (photoId: string) => void;
}

export function FavouriteButton({
  photoId,
  isFavourited = false,
  onToggle,
}: FavouriteButtonProps) {
  const [favourited, setFavourited] = useState(isFavourited);

  const handleClick = () => {
    setFavourited(!favourited);
    onToggle?.(photoId);
  };

  return (
    <Button
      variant={favourited ? "default" : "outline"}
      size="lg"
      onClick={handleClick}
      className={favourited ? "bg-red-500 hover:bg-red-600" : ""}
    >
      <Heart className={`h-5 w-5 mr-2 ${favourited ? "fill-current" : ""}`} />
      {favourited ? "Favourited" : "Add to Favourites"}
    </Button>
  );
}
