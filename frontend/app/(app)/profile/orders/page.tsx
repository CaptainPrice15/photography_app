"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Package, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EmptyState } from "@/components/shared/EmptyState";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-orange-100 text-orange-800",
  completed: "bg-blue-100 text-blue-800",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    try {
      const { data } = await api.get("/orders", { params: { limit: 100 } });
      setOrders(data?.items ?? []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      await loadOrders();
    };
    void run();
  }, [loadOrders]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground mb-8">View your past purchases</p>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center">
            <EmptyState
              title="No orders yet"
              description="Your purchased photographs will appear here"
              icon={<Package className="h-8 w-8 text-muted-foreground" />}
            />
            <Link href="/gallery">
              <Button className="mt-4">Browse Gallery</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {order.order_number}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={STATUS_STYLES[order.status] || ""}>
                          {order.status.toUpperCase()}
                        </Badge>
                        <span className="font-bold">
                          {formatCurrency(order.total_amount)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <Link
                            href={`/gallery/${item.photo_id}`}
                            className="text-primary hover:underline truncate max-w-xs"
                          >
                            {item.photo_title}
                          </Link>
                          <span className="text-muted-foreground">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}