"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import api from "@/lib/api";
import type { Album, Photo } from "@/lib/types";

export default function EditAlbumPage() {
  const router = useRouter();
  const params = useParams();
  const albumId = params.id as string;

  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [coverPhotoId, setCoverPhotoId] = useState("");
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const { data } = await api.get(`/albums/${albumId}`);
        setAlbum(data);
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description || "");
        setIsPublished(data.is_published);
        setIsFeatured(data.is_featured);
        setCoverPhotoId(data.cover_photo_id || "");
        const photosRes = await api.get(`/albums/${albumId}/photos`);
        setAlbumPhotos(photosRes.data ?? []);
    } catch {
      toast.error("Failed to load album");
        router.push("/admin/albums");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlbum();
  }, [albumId, router]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/albums/${albumId}`, {
        title,
        slug,
        description,
        is_published: isPublished,
        is_featured: isFeatured,
        cover_photo_id: coverPhotoId || undefined,
      });
      toast.success("Album updated successfully");
      router.push("/admin/albums");
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : "Failed to update album";
      toast.error(detail);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/albums">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Album</h1>
            <p className="text-muted-foreground">Update album details</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Album Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!album?.slug) {
                      setSlug(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Album title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="album-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Album description"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Album Photos</CardTitle>
            </CardHeader>
            <CardContent>
              {albumPhotos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No photos in this album yet
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {albumPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="aspect-square rounded-lg overflow-hidden bg-muted border relative group"
                    >
                      <ProtectedImage
                        photo={photo}
                        alt={photo.title}
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {photo.id === coverPhotoId && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                          Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Published</Label>
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select a cover photo from the album photos above.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
