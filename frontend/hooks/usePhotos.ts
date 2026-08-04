"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

interface RenderPhoto {
  id: string;
  src: string;
  thumbnail: string | null;
  alt: string;
  width: number;
  height: number;
  title: string;
  collectionId: string;
  featured: boolean;
  format: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  preview_url?: string;
  download_url?: string;
  width: number;
  height: number;
  location_name?: string;
  camera_model?: string;
  category_id?: string;
  is_free?: boolean;
  price?: number;
  view_count: number;
  is_featured: boolean;
  src: string;
}

interface UsePhotosOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  featured?: boolean;
  enabled?: boolean;
}

function transformPhoto(p: RenderPhoto): PhotoItem {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return {
    id: p.id,
    title: p.title,
    preview_url: `${API_URL}${p.src}`,
    download_url: `${API_URL}${p.src}`,
    src: `${API_URL}${p.src}`,
    width: p.width,
    height: p.height,
    location_name: p.collectionId,
    camera_model: undefined,
    category_id: p.collectionId,
    is_free: true,
    price: undefined,
    view_count: 0,
    is_featured: p.featured,
  };
}

export function usePhotos(options: UsePhotosOptions = {}) {
  const { page = 1, limit = 60, search, category, sort, featured, enabled = true } = options;
  const [data, setData] = useState<{ items: PhotoItem[]; total: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchPhotos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data } = await api.get("/photos/all");
        let items: PhotoItem[] = (Array.isArray(data) ? data : []).map(transformPhoto);

        if (search) {
          const q = search.toLowerCase();
          items = items.filter(
            (p) =>
              p.title.toLowerCase().includes(q) ||
              (p.location_name && p.location_name.toLowerCase().includes(q))
          );
        }
        if (category && category !== "all") {
          items = items.filter((p) => p.category_id === category);
        }
        if (sort === "popular") {
          items.sort((a, b) => b.view_count - a.view_count);
        } else if (sort === "price_asc") {
          items.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        } else if (sort === "price_desc") {
          items.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        }

        const total = items.length;
        const start = (page - 1) * limit;
        items = items.slice(start, start + limit);

        if (featured) {
          items = items.filter((p) => p.is_featured);
        }

        setData({ items, total });
      } catch {
        setError("Failed to fetch photos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotos();
  }, [page, limit, search, category, sort, featured, enabled]);

  return { data, isLoading, error };
}
