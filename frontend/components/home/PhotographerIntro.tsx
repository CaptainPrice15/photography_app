"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Camera, Award, Globe } from "lucide-react";

export function PhotographerIntro() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-muted">
              <Image
                src="/images/photographer.jpg"
                alt="Photographer"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-background p-6 rounded-xl shadow-xl border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Camera className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">15+</p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">About the Photographer</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              With over 15 years of experience capturing the world&apos;s most breathtaking
              moments, I specialize in landscape, portrait, and street photography.
              My work has been featured in numerous galleries and publications worldwide.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Every photograph is a story waiting to be told. Through my lens, I aim
              to reveal the beauty in everyday moments and the extraordinary in the ordinary.
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">Award Winner</p>
                <p className="text-xs text-muted-foreground">Multiple Awards</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Globe className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">30+ Countries</p>
                <p className="text-xs text-muted-foreground">Worldwide Travel</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Camera className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">10K+ Photos</p>
                <p className="text-xs text-muted-foreground">In Collection</p>
              </div>
            </div>

            <Link
              href="/about"
              className={cn(
                "inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors",
                "h-9 gap-1.5 px-2.5"
              )}
            >
              Learn More About Me
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
