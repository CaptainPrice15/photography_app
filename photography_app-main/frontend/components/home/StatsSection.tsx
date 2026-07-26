"use client";

import { motion } from "motion/react";
import { Camera, Image, Users, Download } from "lucide-react";

interface Stats {
  photos: number;
  albums: number;
  visitors: number;
  downloads: number;
}

interface StatsSectionProps {
  stats?: Stats;
}

const MOCK_STATS: Stats = {
  photos: 1250,
  albums: 45,
  visitors: 50000,
  downloads: 8500,
};

export function StatsSection({ stats = MOCK_STATS }: StatsSectionProps) {
  const statItems = [
    { icon: Camera, label: "Photos", value: stats.photos },
    { icon: Image, label: "Albums", value: stats.albums },
    { icon: Users, label: "Visitors", value: stats.visitors },
    { icon: Download, label: "Downloads", value: stats.downloads },
  ];

  return (
    <section className="py-20 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Portfolio Statistics</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            A glimpse into the growing collection
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-foreground/10 rounded-full flex items-center justify-center">
                <stat.icon className="h-8 w-8" />
              </div>
              <p className="text-4xl font-bold mb-2">
                {stat.value.toLocaleString()}
              </p>
              <p className="text-primary-foreground/80">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
