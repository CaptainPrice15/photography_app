"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Eye, Download, Share2, Tag, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ExifInfo,
  FavouriteButton,
  AddToCartButton,
  DownloadButton,
  ShareButton,
  RelatedPhotos,
  PhotoComments,
} from "@/components/photo";

interface Photo {
  id: string;
  title: string;
  description?: string;
  original_url: string;
  thumbnail_url: string;
  width: number;
  height: number;
  category?: string;
  tags: string[];
  is_free: boolean;
  price?: number;
  view_count: number;
  download_count: number;
  location_name?: string;
  camera_make?: string;
  camera_model?: string;
  lens?: string;
  focal_length?: string;
  aperture?: string;
  shutter_speed?: string;
  iso?: number;
  taken_at?: string;
}

const MOCK_PHOTO: Photo = {
  id: "1",
  title: "Mountain Sunrise",
  description: "A breathtaking view of the mountains at sunrise, capturing the golden light as it illuminates the peaks.",
  original_url: "/images/placeholder.jpg",
  thumbnail_url: "/images/placeholder.jpg",
  width: 6000,
  height: 4000,
  category: "Landscapes",
  tags: ["mountain", "sunrise", "landscape", "nature", "goldenhour"],
  is_free: false,
  price: 49.99,
  view_count: 1250,
  download_count: 85,
  location_name: "Swiss Alps, Switzerland",
  camera_make: "Sony",
  camera_model: "A7R V",
  lens: "FE 24-70mm GM II",
  focal_length: "24mm",
  aperture: "11",
  shutter_speed: "1/125",
  iso: 100,
  taken_at: "2026-06-15T05:30:00",
};

const MOCK_RELATED = [
  { id: "2", title: "Urban Street", thumbnail_url: "/images/placeholder.jpg" },
  { id: "3", title: "Portrait Study", thumbnail_url: "/images/placeholder.jpg" },
  { id: "4", title: "Ocean Waves", thumbnail_url: "/images/placeholder.jpg" },
  { id: "5", title: "City Lights", thumbnail_url: "/images/placeholder.jpg" },
];

const MOCK_COMMENTS = [
  {
    id: "1",
    user: { username: "alice" },
    content: "Absolutely stunning composition! The light here is beautiful.",
    created_at: "2026-07-20T10:00:00",
  },
  {
    id: "2",
    user: { username: "bob" },
    content: "What an incredible moment captured. Love the colors.",
    created_at: "2026-07-19T15:30:00",
  },
];

export default function PhotoDetailPage() {
  const params = useParams();
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPhoto(MOCK_PHOTO);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

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
          The photo you're looking for doesn't exist or has been removed.
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
              <Image
                src={photo.original_url}
                alt={photo.title}
                fill
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
              {photo.category && (
                <Link href={`/gallery?category=${photo.category.toLowerCase()}`}>
                  <Badge variant="secondary">{photo.category}</Badge>
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
                />
              )}
              <DownloadButton
                photoId={photo.id}
                isFree={photo.is_free}
              />
              <FavouriteButton photoId={photo.id} />
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
                {photo.tags.map((tag) => (
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
          <RelatedPhotos photos={MOCK_RELATED} />
        </section>

        {/* Comments */}
        <Card>
          <CardContent className="p-6">
            <PhotoComments
              photoId={photo.id}
              comments={MOCK_COMMENTS}
              isAuthenticated={false}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
