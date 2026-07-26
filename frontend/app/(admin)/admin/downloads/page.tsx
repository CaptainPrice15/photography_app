"use client";

import { motion } from "motion/react";
import { Download, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_DOWNLOADS = [
  {
    id: "1",
    photo_title: "Mountain Sunrise",
    user_email: "john@example.com",
    status: "completed",
    downloaded_at: "2025-01-15T10:30:00Z",
    expires_at: "2025-01-22T10:30:00Z",
  },
  {
    id: "2",
    photo_title: "Ocean Waves",
    user_email: "jane@example.com",
    status: "pending",
    downloaded_at: "2025-01-14T15:45:00Z",
    expires_at: "2025-01-21T15:45:00Z",
  },
  {
    id: "3",
    photo_title: "City Lights",
    user_email: "bob@example.com",
    status: "expired",
    downloaded_at: "2025-01-10T09:00:00Z",
    expires_at: "2025-01-17T09:00:00Z",
  },
];

const STATS = [
  { title: "Total Downloads", value: "1,234", icon: Download, color: "text-blue-500" },
  { title: "Active Links", value: "89", icon: Clock, color: "text-yellow-500" },
  { title: "Completed", value: "1,100", icon: CheckCircle, color: "text-green-500" },
  { title: "Expired", value: "45", icon: AlertCircle, color: "text-red-500" },
];

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  expired: "bg-red-100 text-red-800",
};

export default function DownloadsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Download Statistics</h1>
        <p className="text-muted-foreground">Track photo downloads and secure links</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Downloaded</TableHead>
                  <TableHead>Expires</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_DOWNLOADS.map((download, index) => (
                  <motion.tr
                    key={download.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell className="font-medium">{download.photo_title}</TableCell>
                    <TableCell>{download.user_email}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_STYLES[download.status] || ""}>
                        {download.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(download.downloaded_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(download.expires_at).toLocaleDateString()}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
