"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { AnalyticsCards } from "@/components/admin/AnalyticsCards";
import { SalesChart } from "@/components/admin/SalesChart";
import { ActivityLog } from "@/components/admin/ActivityLog";
import api from "@/lib/api";

interface DashboardData {
  overview: {
    total_photos: number;
    total_albums: number;
    total_exhibitions: number;
    total_users: number;
    total_orders: number;
    total_revenue: number;
    total_downloads: number;
    total_views: number;
  };
  sales_chart: { date: string; amount: number; count: number }[];
  top_photos: Array<{
    photo_id: string;
    title: string;
    views: number;
    downloads: number;
    revenue: number;
  }>;
  recent_orders: Array<{
    id: string;
    order_number: string;
    total_amount: number;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/analytics/dashboard");
        setData(data);
      } catch {
        // Fallback to empty state
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard</p>
      </div>

      <AnalyticsCards stats={data?.overview} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={data?.sales_chart || []} title="Revenue Over Time" />

        <ActivityLog
          title="Recent Orders"
          activities={(data?.recent_orders || []).map((order) => ({
            id: order.id,
            type: "order_placed" as const,
            message: `Order ${order.order_number} — $${order.total_amount}`,
            created_at: order.created_at,
          }))}
        />
      </div>

      {data?.top_photos && data.top_photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Top Performing Photos</h2>
            <div className="space-y-3">
              {data.top_photos.map((photo, index) => (
                <div
                  key={photo.photo_id || index}
                  className="flex items-center gap-4"
                >
                  <span className="text-sm font-medium text-muted-foreground w-6">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{photo.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {photo.views} views · {photo.downloads} downloads
                    </p>
                  </div>
                  <span className="text-sm font-medium">
                    ${photo.revenue?.toFixed(2) || "0.00"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
