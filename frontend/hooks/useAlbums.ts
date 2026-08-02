"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import type { Album, PaginatedResponse, Photo } from "@/lib/types";

interface CollectionPhoto {
  id: string;
  src: string;
  thumbnail?: string;
  alt?: string;
  width?: number;
  height?: number;
  title?: string;
  collectionId?: string;
  featured?: boolean;
  format?: string;
}

interface Collection {
  id: string;
  slug: string;
  title: string;
  description?: string;
  cover?: string;
  accent?: string;
  accentSoft?: string;
  photos: CollectionPhoto[];
}

function mapCollection(collection: Collection): Album {
  return {
    id: collection.id || collection.slug,
    title: collection.title || collection.slug,
    slug: collection.slug,
    description: collection.description || undefined,
    cover_photo_url: collection.cover || undefined,
    is_published: true,
    is_featured: collection.photos?.some((p) => p.featured) ?? false,
    photo_count: collection.photos?.length || 0,
    created_at: "",
  };
}

function mapPhoto(photo: CollectionPhoto): Photo {
  return {
    id: photo.id,
    title: photo.title || photo.alt || photo.id,
    slug: photo.id,
    original_url: photo.src,
    thumbnail_url: photo.thumbnail || photo.src,
    width: photo.width || 1600,
    height: photo.height || 1200,
    file_size: 0,
    format: photo.format || "jpg",
    is_free: true,
    is_featured: photo.featured ?? false,
    is_published: true,
    view_count: 0,
    download_count: 0,
    tags: [],
    uploaded_by: "",
    created_at: "",
    updated_at: "",
  };
}

interface UseAlbumsOptions {
  page?: number;
  limit?: number;
  featured?: boolean;
}

export function useAlbums(options: UseAlbumsOptions = {}) {
  const { featured } = options;
  const [data, setData] = useState<PaginatedResponse<Album> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: res } = await api.get("/photos/collections");
        const items = Array.isArray(res) ? res : res.items || [];
        const albums = items.map((c: Collection) => mapCollection(c));
        const filtered = featured ? albums.filter((a: Album) => a.is_featured) : albums;

        setData({
          items: filtered,
          total: filtered.length,
          page: 1,
          limit: filtered.length,
          pages: 1,
        });
      } catch {
        setError("Failed to load albums from backend");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [featured]);

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
        const { data: collection } = await api.get<Collection>(`/photos/collections/${albumId}`);
        setAlbum(mapCollection(collection));
        setPhotos((collection.photos || []).map(mapPhoto));
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
