"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";

export interface PhotoItem {
  id: string;
  title: string;
  preview_url?: string;
  download_url?: string;
  src?: string;
  width: number;
  height: number;
  location_name?: string;
  camera_make?: string;
  camera_model?: string;
  category_id?: string;
  is_free?: boolean;
  price?: number;
  view_count: number;
  is_featured: boolean;
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

function transformPhoto(p: any): PhotoItem {
  return {
    id: p.id,
    title: p.title,
    preview_url: p.preview_url,
    download_url: p.download_url,
    src: p.preview_url,
    width: p.width,
    height: p.height,
    location_name: p.location_name,
    camera_make: p.camera_make,
    camera_model: p.camera_model,
    category_id: p.category_id ? String(p.category_id) : undefined,
    is_free: p.is_free,
    price: p.price,
    view_count: p.view_count ?? 0,
    is_featured: p.is_featured,
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
        const { data: res } = await api.get("/photos", {
          params: {
            page,
            limit,
            search: search || undefined,
            category: category || undefined,
            sort: sort || "newest",
          },
        });
        let items: PhotoItem[] = (Array.isArray(res?.items) ? res.items : []).map(transformPhoto);

        if (featured) {
          items = items.filter((p) => p.is_featured);
        }

        setData({ items, total: res?.total ?? items.length });
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
