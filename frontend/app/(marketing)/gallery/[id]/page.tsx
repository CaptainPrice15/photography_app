"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft, Eye, Download, Tag, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import {
  ExifInfo,
  FavouriteButton,
  AddToCartButton,
  DownloadButton,
  ShareButton,
  RelatedPhotos,
  PhotoComments,
} from "@/components/photo";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import api from "@/lib/api";
import { toast } from "sonner";
import type { Photo } from "@/lib/types";

interface CommentView {
  id: string;
  user: { username: string };
  content: string;
  created_at: string;
}

export default function PhotoDetailPage() {
  const params = useParams();
  const photoId = params.id as string;
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [related, setRelated] = useState<Photo[]>([]);
  const [comments, setComments] = useState<CommentView[]>([]);
  const [isFavourited, setIsFavourited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      try {
        const [photoRes, relatedRes, commentsRes] = await Promise.all([
          api.get(`/photos/${photoId}`),
          api.get(`/photos/${photoId}/related`),
          api.get(`/comments/${photoId}`),
        ]);
        if (cancelled) return;
        setPhoto(photoRes.data);
        setRelated(relatedRes.data ?? []);
        const items: { id: string; user_id: string; content: string; created_at: string }[] =
          commentsRes.data?.items ?? [];
        setComments(
          items.map((c) => ({
            id: c.id,
            user: {
              username: user && String(c.user_id) === String(user.id) ? user.username : "Photographer",
            },
            content: c.content,
            created_at: c.created_at,
          }))
        );
        if (isAuthenticated) {
          try {
            const { data } = await api.get(`/favourites/check/${photoId}`);
            setIsFavourited(data.is_favourited);
          } catch {
            setIsFavourited(false);
          }
        }
      } catch {
        setPhoto(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [photoId, isAuthenticated, user]);

  const handleToggleFavourite = useCallback(
    async (id: string) => {
      if (!isAuthenticated) {
        toast.error("Please login to save favourites");
        return;
      }
      try {
        await api.post("/favourites/toggle", { photo_id: id });
        setIsFavourited((prev) => !prev);
      } catch {
        toast.error("Failed to update favourites");
      }
    },
    [isAuthenticated]
  );

  const handleAddComment = useCallback(
    async (_photoId: string, content: string) => {
      try {
        const { data } = await api.post(`/comments/${photoId}`, { content });
        setComments((prev) => [
          ...prev,
          {
            id: data.id,
            user: { username: user?.username || "You" },
            content: data.content,
            created_at: data.created_at,
          },
        ]);
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to post comment");
      }
    },
    [photoId, user]
  );

  const handleAddToCart = useCallback(() => {
    if (photo) addItem(photo);
    toast.success("Added to cart");
  }, [photo, addItem]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4" />
          <div className="aspect-[16/9] bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Photo Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The photo you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/gallery"
          className="inline-flex items-center justify-center h-9 gap-1.5 px-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/80 transition-all"
        >
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Back link */}
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Gallery
        </Link>

        {/* Main photo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photo */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-muted">
              <ProtectedImage
                photo={photo}
                alt={photo.title}
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {photo.view_count.toLocaleString()} views
                </span>
                <span className="flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  {photo.download_count.toLocaleString()} downloads
                </span>
              </div>
              <p>
                {photo.width} × {photo.height} px
              </p>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{photo.title}</h1>
              {photo.category_id && (
                <Link href={`/gallery?category=${photo.category_id}`}>
                  <Badge variant="secondary">{photo.category_id}</Badge>
                </Link>
              )}
            </div>

            {photo.description && (
              <p className="text-muted-foreground leading-relaxed">
                {photo.description}
              </p>
            )}

            {photo.location_name && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {photo.location_name}
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              {!photo.is_free && photo.price && (
                <AddToCartButton
                  photoId={photo.id}
                  price={photo.price}
                  onAddToCart={handleAddToCart}
                />
              )}
              <DownloadButton
                photoId={photo.id}
                isFree={photo.is_free}
                price={photo.price}
              />
              <FavouriteButton
                photoId={photo.id}
                isFavourited={isFavourited}
                onToggle={handleToggleFavourite}
              />
              <ShareButton photoId={photo.id} title={photo.title} />
            </div>

            {photo.price && (
              <p className="text-sm text-muted-foreground text-center">
                High-resolution digital download - ${photo.price}
              </p>
            )}

            <Separator />

            {/* Tags */}
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {(photo.tags || []).map((tag) => (
                  <Link
                    key={tag}
                    href={`/gallery?search=${tag}`}
                    className="text-sm px-3 py-1 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            <Separator />

            {/* EXIF info */}
            <ExifInfo
              camera_make={photo.camera_make}
              camera_model={photo.camera_model}
              lens={photo.lens}
              focal_length={photo.focal_length}
              aperture={photo.aperture}
              shutter_speed={photo.shutter_speed}
              iso={photo.iso}
              taken_at={photo.taken_at}
            />
          </div>
        </div>

        {/* Related photos */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Photos</h2>
          <RelatedPhotos photos={related} />
        </section>

        {/* Comments */}
        <Card>
          <CardContent className="p-6">
            <PhotoComments
              photoId={photo.id}
              comments={comments}
              isAuthenticated={isAuthenticated}
              onAddComment={handleAddComment}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
