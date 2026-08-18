"use client";

import { useState, useEffect, useCallback } from "react";
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
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const fetchAlbums = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (featured) {
          const { data: res } = await api.get("/albums/featured", {
            params: { limit },
          });
          if (cancelled) return;
          const items = Array.isArray(res) ? res : [];
          setData({ items, total: items.length, page: 1, limit: items.length, pages: 1 });
        } else {
          const { data: res } = await api.get("/albums", {
            params: { limit },
          });
          if (cancelled) return;
          setData({
            items: res.items ?? [],
            total: res.total ?? 0,
            page: res.page ?? 1,
            limit: res.limit ?? limit,
            pages: res.pages ?? 1,
          });
        }
      } catch {
        if (!cancelled) setError("Failed to load albums from backend");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchAlbums();
    return () => {
      cancelled = true;
    };
  }, [featured, limit, reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { data, isLoading, error, refetch };
}

export function useAlbumDetail(albumId: string) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!albumId) return;

    let cancelled = false;
    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: res } = await api.get(`/albums/${albumId}`);
        if (cancelled) return;
        setAlbum(res);
        const photosRes = await api.get(`/albums/${albumId}/photos`);
        if (cancelled) return;
        setPhotos(photosRes.data ?? []);
      } catch {
        if (!cancelled) setError("Failed to load album details");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [albumId, reloadKey]);

  const refetch = useCallback(() => setReloadKey((key) => key + 1), []);

  return { album, photos, isLoading, error, refetch };
}
