"use client";

import { motion } from "motion/react";
import { ArrowDown, Camera } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/images/hero-bg.jpg')",
            transform: "scale(1.1)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Camera className="h-6 w-6 text-white/80" />
            <span className="text-white/80 tracking-widest uppercase text-sm">
              Photography Portfolio
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Capturing Moments
            <br />
            <span className="text-white/80">That Last Forever</span>
          </h1>

          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Explore a curated collection of stunning photographs from around
            the world. Every image tells a unique story.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gallery"
              className={cn(
                "inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 transition-colors",
                "h-9 gap-1.5 px-2.5"
              )}
            >
              View Gallery
            </Link>
            <Link
              href="/about"
              className={cn(
                "inline-flex items-center justify-center rounded-lg border border-white/30 bg-transparent px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors",
                "h-9 gap-1.5 px-2.5"
              )}
            >
              About the Artist
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowDown className="h-6 w-6 text-white/50" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
