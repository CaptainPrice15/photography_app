"use client";

import { motion } from "motion/react";
import { MoreVertical, Eye, Edit, Trash2, Image as ImageIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProtectedImage } from "@/components/photo/ProtectedImage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { Photo } from "@/lib/types";

interface PhotoTableProps {
  photos: Photo[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onToggleFeatured?: (id: string, featured: boolean) => void;
  onTogglePublished?: (id: string, published: boolean) => void;
}

export function PhotoTable({
  photos,
  isLoading,
  onDelete,
  onToggleFeatured,
  onTogglePublished,
}: PhotoTableProps) {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8">
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading photos...</span>
          </div>
        </TableCell>
      </TableRow>
    );
  }

  if (photos.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
          No photos found
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {photos.map((photo, index) => (
        <motion.tr
          key={photo.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <TableCell className="w-20">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden relative">
                {photo.preview_url || photo.download_url ? (
                <ProtectedImage
                  photo={photo}
                  alt={photo.title}
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-muted-foreground m-auto mt-4" aria-hidden="true" />
              )}
              {photo.is_featured && (
                <Star className="absolute top-1 right-1 h-4 w-4 text-yellow-500 fill-yellow-500" />
              )}
            </div>
          </TableCell>
          <TableCell>
            <p className="font-medium truncate max-w-xs">{photo.title}</p>
            <p className="text-xs text-muted-foreground">
              {photo.camera_model || "No camera info"}
            </p>
          </TableCell>
          <TableCell>
            <Badge variant="secondary">{photo.category_id || "Uncategorized"}</Badge>
          </TableCell>
          <TableCell>
            {photo.is_free ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : photo.price ? (
              <span className="font-medium">{formatCurrency(photo.price)}</span>
            ) : (
              <span className="text-muted-foreground">Not for sale</span>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              <Badge variant={photo.is_published ? "default" : "secondary"}>
                {photo.is_published ? "Published" : "Draft"}
              </Badge>
              {photo.is_featured && (
                <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                  Featured
                </Badge>
              )}
            </div>
          </TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => window.location.href = `/gallery/${photo.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = `/admin/photos/${photo.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onTogglePublished?.(photo.id, !photo.is_published)}
                >
                  {photo.is_published ? "Unpublish" : "Publish"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggleFeatured?.(photo.id, !photo.is_featured)}
                >
                  {photo.is_featured ? "Remove Featured" : "Make Featured"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(photo.id)}
                  className="text-red-500"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </motion.tr>
      ))}
    </>
  );
}
