"use client";

import { motion } from "motion/react";
import {
  Camera,
  User,
  ShoppingCart,
  Download,
  Tag,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: "photo_upload" | "user_register" | "order_placed" | "download" | "exhibition_created" | "category_added";
  message: string;
  created_at: string;
}

interface ActivityLogProps {
  activities: Activity[];
  title?: string;
}

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  photo_upload: <Camera className="h-4 w-4" />,
  user_register: <User className="h-4 w-4" />,
  order_placed: <ShoppingCart className="h-4 w-4" />,
  download: <Download className="h-4 w-4" />,
  exhibition_created: <Calendar className="h-4 w-4" />,
  category_added: <Tag className="h-4 w-4" />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  photo_upload: "bg-blue-100 text-blue-600",
  user_register: "bg-green-100 text-green-600",
  order_placed: "bg-yellow-100 text-yellow-600",
  download: "bg-purple-100 text-purple-600",
  exhibition_created: "bg-pink-100 text-pink-600",
  category_added: "bg-orange-100 text-orange-600",
};

export function ActivityLog({ activities, title = "Recent Activity" }: ActivityLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4"
              >
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center ${
                    ACTIVITY_COLORS[activity.type] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {ACTIVITY_ICONS[activity.type] || <TrendingUp className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
