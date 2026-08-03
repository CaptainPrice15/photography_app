"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  HeroBanner,
  FeaturedPhotos,
  LatestUploads,
  PopularCollections,
  FeaturedAlbums,
  ExhibitionsPreview,
  PhotographerIntro,
  StatsSection,
} from "@/components/home";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroBanner />

      {/* Stats Section */}
      <StatsSection />

      {/* Featured Photos */}
      <FeaturedPhotos />

      {/* Latest Uploads */}
      <LatestUploads />

      {/* Featured Albums */}
      <FeaturedAlbums />

      {/* Popular Collections */}
      <PopularCollections />

      {/* Exhibitions Preview */}
      <ExhibitionsPreview />

      {/* Photographer Introduction */}
      <PhotographerIntro />

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Start Your Collection</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Create an account to save favourites, build collections, and purchase digital downloads.
            </p>
            <Link href="/register">
              <Button size="lg">Get Started</Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
