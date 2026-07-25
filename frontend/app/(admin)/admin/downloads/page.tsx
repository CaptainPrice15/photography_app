"use client";

import { motion } from "motion/react";
import { Search, MoreVertical, Eye, Download, Globe, Clock, AlertCircle, CheckCircle, XCircle, FileDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState([
    {
      id: "1",
      user: { username: "johndoe", full_name: "John Doe", email: "john@example.com" },
      photo: { title: "Mountain Sunset", thumbnail: null },
      order: { order_number: "ORD-2025-000001" },
      download_token: "dlt_abc123...",
      expires_at: "2025-02-10T14:32:00Z",
      download_count: 2,
      max_downloads: 5,
      ip_address: "192.168.1.100",
      created_at: "2025-01-10T14:35:00Z",
    },
    {
      id: "2",
      user: { username: "janesmith", full_name: "Jane Smith", email: "jane@example.com" },
      photo: { title: "City Lights", thumbnail: null },
      order: { order_number: "ORD-2025-000002" },
      download_token: "dlt_def456...",
      expires_at: "2025-02-12T09:20:00Z",
      download_count: 1,
      max_downloads: 5,
      ip_address: "10.0.0.45",
      created_at: "2025-01-12T09:25:00Z",
    },
    {
      id: "3",
      user: { username: "johndoe", full_name: "John Doe", email: "john@example.com" },
      photo: { title: "Ocean Waves", thumbnail: null },
      order: { order_number: "ORD-2025-000001" },
      download_token: "dlt_ghi789...",
      expires_at: "2025-01-20T14:32:00Z",
      download_count: 5,
      max_downloads: 5,
      ip_address: "192.168.1.100",
      created_at: "2025-01-10T14:35:00Z",
    },
    {
      id: "4",
      user: { username: "bobwilson", full_name: "Bob Wilson", email: "bob@example.com" },
      photo: { title: "Desert Dunes", thumbnail: null },
      order: { order_number: "ORD-2025-000004" },
      download_token: "dlt_jkl012...",
      expires_at: "2025-02-05T11:30:00Z",
      download_count: 0,
      max_downloads: 5,
      ip_address: "172.16.0.88",
      created_at: "2025-01-05T11:25:00Z",
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredDownloads = downloads.filter(
    (d) =>
      d.photo.title.toLowerCase().includes(search.toLowerCase()) ||
      d.user.username.toLowerCase().includes(search.toLowerCase()) ||
      d.order.order_number.toLowerCase().includes(search.toLowerCase())
  );

  const getStatus = (d: typeof downloads[0]) => {
    const now = new Date();
    const expires = new Date(d.expires_at);
    
    if (d.download_count >= d.max_downloads) {
      return { label: "Limit Reached", variant: "destructive" as const, icon: XCircle };
    }
    if (now > expires) {
      return { label: "Expired", variant: "outline" as const, icon: Clock };
    }
    if (d.download_count > 0) {
      return { label: "Active", variant: "default" as const, icon: CheckCircle };
    }
    return { label: "Available", variant: "secondary" as const, icon: FileDown };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Download Management</h1>
          <p className="text-muted-foreground">Monitor and manage photo downloads</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search downloads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDownloads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No downloads found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDownloads.map((d, index) => {
                    const status = getStatus(d);
                    const StatusIcon = status.icon;
                    return (
                      <motion.tr
                        key={d.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <Globe className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-medium truncate max-w-xs">{d.photo.title}</p>
                              <p className="text-xs text-muted-foreground">Digital Download</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{d.user.full_name}</p>
                          <p className="text-xs text-muted-foreground">@{d.user.username}</p>
                          <p className="text-xs text-muted-foreground">{d.user.email}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-mono text-sm">{d.order.order_number}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant} className="gap-1">
                            <status.icon className="h-3 w-3" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono">{d.download_count} / {d.max_downloads}</span>
                          <div className="w-32 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${(d.download_count / d.max_downloads) * 100}%` }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <p>{format(new Date(d.expires_at), "MMM d, yyyy")}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(d.expires_at) > new Date()
                              ? `in ${formatDistanceToNow(new Date(d.expires_at), { addSuffix: true })}`
                              : `${formatDistanceToNow(new Date(d.expires_at), { addSuffix: true })} ago`}
                          </p>
                        </TableCell>
                        <TableCell>{format(new Date(d.created_at), "MMM d, yyyy HH:mm")}</TableCell>
                        <TableCell className="font-mono text-sm">{d.ip_address}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log("View", d.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Download", d.id)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download File
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Extend", d.id)}>
                                <Clock className="h-4 w-4 mr-2" />
                                Extend Expiry
                              </DropdownMenuItem>
                              {d.download_count >= d.max_downloads && (
                                <DropdownMenuItem onClick={() => console.log("Reset", d.id)} className="text-blue-500">
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Reset Download Count
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => console.log("Revoke", d.id)} className="text-red-500">
                                <XCircle className="h-4 w-4 mr-2" />
                                Revoke Access
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  }
                )
              )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
                <p className="text-3xl font-bold">{downloads.reduce((sum, d) => sum + d.download_count, 0)}</p>
              </div>
              <Download className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Downloads</p>
                <p className="text-3xl font-bold">{downloads.filter((d) => d.download_count < d.max_downloads && new Date(d.expires_at) > new Date()).length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expired</p>
                <p className="text-3xl font-bold">{downloads.filter((d) => new Date(d.expires_at) < new Date()).length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Limit Reached</p>
                <p className="text-3xl font-bold">{downloads.filter((d) => d.download_count >= d.max_downloads).length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}