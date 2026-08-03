"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/lib/api";

interface UploadFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  photo_id?: string;
}

export default function UploadPhotosPage() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [categories] = useState<{ id: string; name: string }[]>([]);

  const addFiles = useCallback((newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      status: "pending" as const,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...uploadFiles]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      addFiles(droppedFiles);
    },
    [addFiles]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    setIsPublishing(true);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "success") continue;

      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading", progress: 0 } : f
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", files[i].file);
        if (title) formData.append("title", title);
        if (description) formData.append("description", description);
        if (categoryId) formData.append("category_id", categoryId);
        if (!isFree && price) formData.append("price", price);
        formData.append("is_free", String(isFree));
        formData.append("is_published", "true");

        await api.post("/uploads", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const progress = e.total ? Math.round((e.loaded * 100) / e.total) : 0;
            setFiles((prev) =>
              prev.map((f, idx) => (idx === i ? { ...f, progress } : f))
            );
          },
        });

        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "success", progress: 100 } : f
          )
        );
        successCount++;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Upload failed";
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: "error", error: errorMsg }
              : f
          )
        );
        errorCount++;
      }
    }

    setIsPublishing(false);
    if (successCount > 0) {
      toast.success(`${successCount} photo(s) uploaded successfully`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} photo(s) failed to upload`);
    }
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const successCount = files.filter((f) => f.status === "success").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/photos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Upload Photos</h1>
          <p className="text-muted-foreground">
            Upload multiple photos to your gallery
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Drop Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">
                  Drag & drop photos here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Browse Files
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>

          {files.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Files ({files.length})</CardTitle>
                  <div className="flex gap-2">
                    {successCount > 0 && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {successCount} uploaded
                      </Badge>
                    )}
                    {pendingCount > 0 && (
                      <Badge variant="secondary">{pendingCount} pending</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {files.map((uploadFile, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
                        {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URL cannot use next/image */}
                        <img
                          src={uploadFile.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {uploadFile.status === "uploading" && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-white text-sm font-medium">
                              {uploadFile.progress}%
                            </div>
                          </div>
                        )}
                        {uploadFile.status === "success" && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                        {uploadFile.status === "error" && (
                          <div className="absolute top-2 right-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <div className="bg-black/50 rounded-full p-1">
                          <X className="h-3 w-3 text-white" />
                        </div>
                      </button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {uploadFile.file.name}
                      </p>
                      {uploadFile.status === "error" && (
                        <p className="text-xs text-red-500 truncate">
                          {uploadFile.error}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Applied to all photos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Applied to all photos"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pricing</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is-free"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="is-free" className="text-sm">
                    Free download
                  </Label>
                </div>
                {!isFree && (
                  <Input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Price in USD"
                    min="0"
                    step="0.01"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={uploadFiles}
            disabled={files.length === 0 || isPublishing}
            className="w-full"
            size="lg"
          >
            {isPublishing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload {files.length > 0 ? `${files.length} Photo(s)` : "Photos"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
