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
import api from "@/lib/api";
import type { Exhibition } from "@/lib/types";

export default function EditExhibitionPage() {
  const router = useRouter();
  const params = useParams();
  const exhibitionId = params.id as string;

  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isVirtual, setIsVirtual] = useState(false);
  const [exhibitionUrl, setExhibitionUrl] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    const fetchExhibition = async () => {
      try {
        const { data } = await api.get(`/exhibitions/${exhibitionId}`);
        setExhibition(data);
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description);
        setLongDescription(data.long_description || "");
        setVenue(data.venue || "");
        setLocation(data.location || "");
        setStartDate(data.start_date?.split("T")[0] || "");
        setEndDate(data.end_date?.split("T")[0] || "");
        setIsVirtual(data.is_virtual);
        setExhibitionUrl(data.exhibition_url || "");
        setIsPublished(data.is_published);
    } catch (err: unknown) {
      toast.error("Failed to load exhibition");
        router.push("/admin/exhibitions");
      } finally {
        setIsLoading(false);
      }
    };
    fetchExhibition();
  }, [exhibitionId, router]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/exhibitions/${exhibitionId}`, {
        title,
        slug,
        description,
        long_description: longDescription || undefined,
        venue: venue || undefined,
        location: location || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        is_virtual: isVirtual,
        exhibition_url: isVirtual ? exhibitionUrl : undefined,
        is_published: isPublished,
      });
      toast.success("Exhibition updated successfully");
      router.push("/admin/exhibitions");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to update exhibition");
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
          <Link href="/admin/exhibitions">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Exhibition</h1>
            <p className="text-muted-foreground">Update exhibition details</p>
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
              <CardTitle>Exhibition Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!exhibition?.slug) {
                      setSlug(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Exhibition title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="exhibition-slug"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="long-description">Full Description</Label>
                <Textarea
                  id="long-description"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Detailed description"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Venue & Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="Venue name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
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
                <Label htmlFor="virtual">Virtual Exhibition</Label>
                <Switch
                  id="virtual"
                  checked={isVirtual}
                  onCheckedChange={setIsVirtual}
                />
              </div>
              {isVirtual && (
                <div className="space-y-2">
                  <Label htmlFor="exhibition-url">Exhibition URL</Label>
                  <Input
                    id="exhibition-url"
                    value={exhibitionUrl}
                    onChange={(e) => setExhibitionUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              {exhibition?.cover_image_url ? (
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  <img
                    src={exhibition.cover_image_url}
                    alt={exhibition.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No cover image</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
