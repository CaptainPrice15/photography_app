"use client";

import { motion } from "motion/react";
import { DollarSign, Users, Image as ImageIcon, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsStats {
  total_photos?: number;
  total_users?: number;
  total_revenue?: number;
  total_downloads?: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  iconColor: string;
}

export function AnalyticsCards({ stats }: { stats: AnalyticsStats | null | undefined }) {
  const cards: StatCardProps[] = [
    {
      title: "Total Photos",
      value: stats?.total_photos || 0,
      icon: <ImageIcon className="h-5 w-5" aria-hidden="true" />,
      iconColor: "text-blue-500",
    },
    {
      title: "Total Users",
      value: stats?.total_users || 0,
      icon: <Users className="h-5 w-5" />,
      iconColor: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: `$${stats?.total_revenue || 0}`,
      icon: <DollarSign className="h-5 w-5" />,
      iconColor: "text-yellow-500",
    },
    {
      title: "Total Downloads",
      value: stats?.total_downloads || 0,
      icon: <Download className="h-5 w-5" />,
      iconColor: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={card.iconColor}>{card.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.change !== undefined && (
                <p className="text-xs text-muted-foreground mt-1">
                  {card.change >= 0 ? (
                    <span className="text-green-500">↑ {card.change}% vs last month</span>
                  ) : (
                    <span className="text-red-500">↓ {Math.abs(card.change)}% vs last month</span>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}