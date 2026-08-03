"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import type { Photo, PaginatedResponse } from "@/lib/types";

interface UsePhotosOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
  featured?: boolean;
  enabled?: boolean;
}

export function usePhotos(options: UsePhotosOptions = {}) {
  const { page = 1, limit = 20, search, category, sort, featured, enabled = true } = options;
  const [data, setData] = useState<PaginatedResponse<Photo> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchPhotos = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (sort) params.set("sort", sort);
        if (featured) params.set("featured", "true");

        const { data } = await api.get(`/photos?${params.toString()}`);
        setData({
          items: data.items ?? [],
          total: data.total ?? 0,
          page: data.page ?? page,
          limit: data.limit ?? limit,
          pages: data.pages ?? 1,
        });
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
