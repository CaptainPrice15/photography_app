"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
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
import { PhotoTable } from "@/components/admin/PhotoTable";
import api from "@/lib/api";
import type { Photo } from "@/lib/types";
import { useDebounce } from "@/hooks/useDebounce";

export default function PhotosPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;

      const { data } = await api.get("/photos", { params });
      const items = data.items || data;
      setPhotos(Array.isArray(items) ? items : []);
      setTotal(data.total || items.length || 0);
      setPages(data.pages || 1);
    } catch {
      toast.error("Failed to load photos");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    const run = async () => {
      await fetchPhotos();
    };
    void run();
  }, [fetchPhotos]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      await api.delete(`/photos/${id}`);
      toast.success("Photo deleted");
      fetchPhotos();
    } catch {
      toast.error("Failed to delete photo");
    }
  };

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      await api.put(`/photos/${id}`, { is_published: published });
      toast.success(published ? "Photo published" : "Photo unpublished");
      fetchPhotos();
    } catch {
      toast.error("Failed to update photo");
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      await api.put(`/photos/${id}`, { is_featured: featured });
      toast.success(featured ? "Photo featured" : "Photo unfeatured");
      fetchPhotos();
    } catch {
      toast.error("Failed to update photo");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Photos Management</h1>
          <p className="text-muted-foreground">Manage your photo gallery</p>
        </div>
        <Link href="/admin/photos/upload">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Photos
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search photos..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm w-40"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="featured">Featured</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <PhotoTable
                  photos={photos}
                  isLoading={isLoading}
                  onDelete={handleDelete}
                  onTogglePublished={handleTogglePublished}
                  onToggleFeatured={handleToggleFeatured}
                />
              </TableBody>
            </Table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of{" "}
                {total} photos
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
