"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Plus, Search, Edit, Trash2, MoreVertical, MapPin, Globe, Calendar, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Exhibition } from "@/lib/types";
import { useDebounce } from "@/hooks/useDebounce";

export default function ExhibitionsPage() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const debouncedSearch = useDebounce(search, 500);

  const fetchExhibitions = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (debouncedSearch) params.search = debouncedSearch;

      const { data } = await api.get("/exhibitions", { params });
      const items = data.items || data;
      setExhibitions(Array.isArray(items) ? items : []);
    } catch {
      toast.error("Failed to load exhibitions");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const run = async () => {
      await fetchExhibitions();
    };
    void run();
  }, [fetchExhibitions]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exhibition?")) return;
    try {
      await api.delete(`/exhibitions/${id}`);
      toast.success("Exhibition deleted");
      fetchExhibitions();
    } catch {
      toast.error("Failed to delete exhibition");
    }
  };

  const getStatus = (ex: Exhibition) => {
    const now = new Date();
    const start = new Date(ex.start_date);
    const end = ex.end_date ? new Date(ex.end_date) : null;

    if (!ex.is_published) return { label: "Draft", variant: "secondary" as const };
    if (now < start) return { label: "Upcoming", variant: "default" as const };
    if (end && now > end) return { label: "Ended", variant: "outline" as const };
    return { label: "Active", variant: "default" as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exhibitions Management</h1>
          <p className="text-muted-foreground">Manage exhibitions and shows</p>
        </div>
        <Link href="/admin/exhibitions/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Exhibition
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search exhibitions..."
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
                  <TableHead>Title</TableHead>
                  <TableHead>Venue / Location</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <span>Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : exhibitions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No exhibitions found
                    </TableCell>
                  </TableRow>
                ) : (
                  exhibitions.map((ex, index) => {
                    const status = getStatus(ex);
                    return (
                      <motion.tr
                        key={ex.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <TableCell>
                          <p className="font-medium truncate max-w-xs">{ex.title}</p>
                        </TableCell>
                        <TableCell>
                          {ex.venue && <p className="font-medium">{ex.venue}</p>}
                          {ex.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {ex.location}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(ex.start_date), "MMM d, yyyy")}
                            {ex.end_date && (
                              <> - {format(new Date(ex.end_date), "MMM d, yyyy")}</>
                            )}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={ex.is_virtual ? "secondary" : "default"}>
                            {ex.is_virtual ? (
                              <>
                                <Globe className="h-3 w-3 mr-1" />
                                Virtual
                              </>
                            ) : (
                              <>
                                <MapPin className="h-3 w-3 mr-1" />
                                Physical
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.location.href = `/exhibitions/${ex.id}`}>
                                <ImageIcon className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => window.location.href = `/admin/exhibitions/${ex.id}`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(ex.id)}
                                className="text-red-500"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
