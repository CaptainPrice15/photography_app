"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Camera, Image, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const STATS = [
  { icon: Camera, label: "Photographs", value: "500+" },
  { icon: Image, label: "Albums", value: "50+" },
  { icon: Users, label: "Collectors", value: "1,200+" },
  { icon: Download, label: "Downloads", value: "3,000+" },
];

const FEATURED_CATEGORIES = [
  { name: "Landscapes", slug: "landscapes", image: "/images/categories/landscape.jpg" },
  { name: "Portraits", slug: "portraits", image: "/images/categories/portrait.jpg" },
  { name: "Street", slug: "street", image: "/images/categories/street.jpg" },
  { name: "Nature", slug: "nature", image: "/images/categories/nature.jpg" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background z-10" />
        <div className="absolute inset-0 bg-[url('/images/hero.jpg')] bg-cover bg-center" />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Capturing Moments,
              <br />
              <span className="text-primary">Sharing Stories</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore a curated collection of photography. Purchase high-quality digital downloads
              for personal or commercial use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gallery">
                <Button size="lg" className="gap-2">
                  Browse Gallery
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  About the Photographer
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover photographs organized by theme and style
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/gallery?category=${category.slug}`}>
                  <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                      <div className="absolute inset-0 bg-muted animate-pulse" />
                      <div className="absolute bottom-4 left-4 z-20">
                        <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
