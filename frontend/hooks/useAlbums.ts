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
  const { page = 1, limit = 20, featured } = options;
  const [data, setData] = useState<PaginatedResponse<Album> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const endpoint = featured ? "/v1/albums/featured" : `/v1/albums?page=${page}&limit=${limit}`;
        const { data: res } = await api.get(endpoint);

        if (Array.isArray(res)) {
          setData({
            items: res,
            total: res.length,
            page: 1,
            limit: res.length,
            pages: 1,
          });
        } else {
          setData({
            items: res.items || [],
            total: res.total || 0,
            page: res.page || page,
            limit: res.limit || limit,
            pages: res.pages || 1,
          });
        }
      } catch (err) {
        setError("Failed to load albums from backend");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [page, limit, featured]);

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
        const { data: albumData } = await api.get(`/v1/albums/${albumId}`);
        setAlbum(albumData);

        // Fetch photos for this album or general list
        const { data: photosData } = await api.get(`/v1/photos?limit=50`);
        const items = Array.isArray(photosData) ? photosData : photosData.items || [];
        setPhotos(items);
      } catch (err) {
        setError("Failed to load album details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [albumId]);

  return { album, photos, isLoading, error };
}
