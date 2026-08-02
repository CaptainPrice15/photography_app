"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import type { Album, PaginatedResponse, Photo } from "@/lib/types";

interface UseAlbumsOptions {
  page?: number;
  limit?: number;
  featured?: boolean;
}

export function useAlbums(options: UseAlbumsOptions = {}) {
  const { featured, limit = 20 } = options;
  const [data, setData] = useState<PaginatedResponse<Album> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (featured) {
          const { data: res } = await api.get("/albums/featured", {
            params: { limit },
          });
          const items = Array.isArray(res) ? res : [];
          setData({ items, total: items.length, page: 1, limit: items.length, pages: 1 });
        } else {
          const { data: res } = await api.get("/albums", {
            params: { limit },
          });
          setData({
            items: res.items ?? [],
            total: res.total ?? 0,
            page: res.page ?? 1,
            limit: res.limit ?? limit,
            pages: res.pages ?? 1,
          });
        }
      } catch {
        setError("Failed to load albums from backend");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [featured, limit]);

  return { data, isLoading, error };
}

export function useAlbumDetail(albumId: string) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!albumId) return;

    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: res } = await api.get(`/albums/${albumId}`);
        setAlbum(res);
        const photosRes = await api.get(`/albums/${albumId}/photos`);
        setPhotos(photosRes.data ?? []);
      } catch {
        setError("Failed to load album details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [albumId]);

  return { album, photos, isLoading, error };
}
