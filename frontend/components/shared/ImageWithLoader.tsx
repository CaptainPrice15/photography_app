"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImageWithLoaderProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
}

export function ImageWithLoader({
  src,
  alt,
  className,
  fallbackSrc = "/images/placeholder.jpg",
  ...props
}: ImageWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      <Image
        src={hasError ? fallbackSrc : src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        {...props}
      />
    </div>
  );
}
