"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import { Upload, X, Check, Sparkles } from "lucide-react";

interface UploadFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

interface UploadZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (files: File[]) => void;
}

export function UploadZone({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFileSelect,
}: UploadZoneProps) {
  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((f) =>
        f.type.startsWith("image/")
      );
      onFileSelect(files);
    },
    [onFileSelect]
  );

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 glass-panel ${
        isDragging
          ? "border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(212,175,55,0.25)]"
          : "border-border/60 hover:border-amber-500/50 hover:bg-muted/30"
      }`}
    >
      <div className="p-4 rounded-full bg-amber-500/10 text-amber-500 w-16 h-16 mx-auto mb-4 flex items-center justify-center border border-amber-500/30">
        <Upload className="h-8 w-8" />
      </div>
      <h3 className="font-heading font-bold text-xl mb-1">Drag & Drop Batch Photos</h3>
      <p className="text-sm text-muted-foreground mb-6">
        RAW or high-res WebP, JPEG, PNG format with automatic EXIF parsing
      </p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <span className="inline-flex items-center gap-2 rounded-full text-sm font-semibold border border-amber-500/40 bg-amber-500 hover:bg-amber-600 text-black px-6 py-2.5 cursor-pointer shadow-lg shadow-amber-500/20 transition-all">
          <Sparkles className="h-4 w-4" />
          Select Fine Art Photos
        </span>
      </label>
    </div>
  );
}

interface UploadFilePreviewProps {
  uploadFile: UploadFile;
  index: number;
  onRemove: (index: number) => void;
}

export function UploadFilePreview({
  uploadFile,
  index,
  onRemove,
}: UploadFilePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group rounded-2xl overflow-hidden border border-border/60 bg-card glass-panel p-1.5 shadow-md"
    >
      <div className="aspect-square rounded-xl overflow-hidden relative bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URL cannot use next/image */}
        <img
          src={uploadFile.preview}
          alt={`Upload ${index + 1}`}
          className="w-full h-full object-cover"
        />
        {uploadFile.status === "uploading" && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center">
            <div className="text-amber-400 font-mono text-sm font-bold">
              {uploadFile.progress}%
            </div>
          </div>
        )}
        {uploadFile.status === "success" && (
          <div className="absolute top-2 right-2">
            <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        )}
        {uploadFile.status === "error" && (
          <div className="absolute top-2 right-2">
            <div className="h-6 w-6 rounded-full bg-rose-500 flex items-center justify-center shadow-lg">
              <X className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        )}

        <button
          onClick={() => onRemove(index)}
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 hover:bg-rose-600 text-white rounded-full p-1 shadow-md"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-xs font-medium text-foreground mt-2 px-1 truncate">
        {uploadFile.file.name}
      </p>
      {uploadFile.status === "error" && uploadFile.error && (
        <p className="text-[11px] text-rose-500 px-1 truncate">{uploadFile.error}</p>
      )}
    </motion.div>
  );
}
