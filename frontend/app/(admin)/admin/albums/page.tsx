"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Plus, Search, Edit, Trash2, Image, MoreVertical, Eye } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import api from "@/lib/api";
import type { Album } from "@/lib/types";
import { useDebounce } from "@/hooks/useDebounce";

export default function AlbumsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  const fetchAlbums = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;

      const { data } = await api.get("/albums", { params });
      const items = data.items || data;
      setAlbums(Array.isArray(items) ? items : []);
      setTotal(data.total || items.length || 0);
      setPages(data.pages || 1);
    } catch {
      toast.error("Failed to load albums");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return;
    try {
      await api.delete(`/albums/${id}`);
      toast.success("Album deleted");
      fetchAlbums();
    } catch {
      toast.error("Failed to delete album");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Albums Management</h1>
          <p className="text-muted-foreground">Manage photo albums and collections</p>
        </div>
        <Link href="/admin/albums/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Album
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search albums..."
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
                  <TableHead>Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Photos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
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
                ) : albums.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No albums found
                    </TableCell>
                  </TableRow>
                ) : (
                  albums.map((album, index) => (
                    <motion.tr
                      key={album.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <TableCell className="w-20">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          {album.cover_photo_id ? (
                            <Image className="h-8 w-8 text-muted-foreground m-auto mt-4" />
                          ) : (
                            <Image className="h-8 w-8 text-muted-foreground m-auto mt-4" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium truncate max-w-xs">{album.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {album.description?.substring(0, 50)}
                          {album.description && album.description.length > 50 ? "..." : ""}
                        </p>
                      </TableCell>
                      <TableCell>{album.photo_count} photos</TableCell>
                      <TableCell>
                        <Badge variant={album.is_published ? "default" : "secondary"}>
                          {album.is_published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {album.is_featured && (
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.location.href = `/albums/${album.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = `/admin/albums/${album.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(album.id)}
                              className="text-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
                {total} albums
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setPage(Math.max(1, page - 1))} />
                  </PaginationItem>
                  {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                    const start = Math.max(1, Math.min(page - 2, pages - 4));
                    const p = start + i;
                    if (p > pages) return null;
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink isActive={page === p} onClick={() => setPage(p)}>
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  <PaginationItem>
                    <PaginationNext onClick={() => setPage(Math.min(pages, page + 1))} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
