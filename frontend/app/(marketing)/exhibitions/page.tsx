"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, ArrowRight, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Exhibition {
  id: string;
  title: string;
  slug: string;
  description: string;
  venue?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  cover_image_url?: string;
  is_virtual: boolean;
  exhibition_url?: string;
}

const MOCK_EXHIBITIONS: Exhibition[] = [
  {
    id: "1",
    title: "Urban Perspectives",
    slug: "urban-perspectives",
    description: "A deep dive into the geometry and soul of modern cities. This exhibition explores how architecture and human activity interact in urban environments.",
    venue: "City Art Gallery",
    location: "New York, NY",
    start_date: "2026-08-15",
    end_date: "2026-09-30",
    cover_image_url: "/images/placeholder.jpg",
    is_virtual: false,
  },
  {
    id: "2",
    title: "Digital Landscapes",
    slug: "digital-landscapes",
    description: "An immersive online exhibition showcasing the world's most stunning natural landscapes, from Arctic glaciers to tropical rainforests.",
    venue: "Online Exhibition",
    location: "Virtual",
    start_date: "2026-07-01",
    end_date: "2026-12-31",
    cover_image_url: "/images/placeholder.jpg",
    is_virtual: true,
    exhibition_url: "https://example.com/exhibition",
  },
  {
    id: "3",
    title: "Faces of the World",
    slug: "faces-of-the-world",
    description: "A portrait photography exhibition celebrating human diversity and emotion across cultures.",
    venue: "Metropolitan Museum of Photography",
    location: "Los Angeles, CA",
    start_date: "2026-10-05",
    end_date: "2026-11-20",
    cover_image_url: "/images/placeholder.jpg",
    is_virtual: false,
  },
  {
    id: "4",
    title: "Minimalist Nature",
    slug: "minimalist-nature",
    description: "Finding simplicity and elegance in the natural world through careful composition and timing.",
    venue: "Gallery 360",
    location: "London, UK",
    start_date: "2026-09-01",
    end_date: "2026-10-15",
    cover_image_url: "/images/placeholder.jpg",
    is_virtual: true,
  },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setExhibitions(MOCK_EXHIBITIONS);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Exhibitions</h1>
        <p className="text-muted-foreground mb-8">
          View current and upcoming photography exhibitions
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[16/9] bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exhibitions.map((exhibition, index) => (
              <motion.div
                key={exhibition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/exhibitions/${exhibition.id}`} className="group block">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
                    {exhibition.cover_image_url ? (
                      <Image
                        src={exhibition.cover_image_url}
                        alt={exhibition.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={exhibition.is_virtual ? "default" : "secondary"}>
                          {exhibition.is_virtual ? (
                            <span className="flex items-center gap-1">
                              <Monitor className="h-3 w-3" />
                              Virtual
                            </span>
                          ) : (
                            "In-Person"
                          )}
                        </Badge>
                      </div>
                      <h3 className="text-white font-bold text-xl mb-2 group-hover:underline">
                        {exhibition.title}
                      </h3>
                      <p className="text-white/70 text-sm line-clamp-2 mb-3">
                        {exhibition.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-white/70 text-sm">
                        {exhibition.venue && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {exhibition.venue}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(exhibition.start_date)}
                          {exhibition.end_date && ` - ${formatDate(exhibition.end_date)}`}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        View exhibition <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
