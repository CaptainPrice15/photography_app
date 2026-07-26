"use client";

import { useCallback } from "react";
import { motion } from "motion/react";
import { Upload, X, Image } from "lucide-react";

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
      className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      }`}
    >
      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <p className="text-lg font-medium mb-2">Drag & drop photos here</p>
      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload">
        <span className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer">
          Browse Files
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
      className="relative group"
    >
      <div className="aspect-square rounded-lg overflow-hidden bg-muted border">
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
            <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
        {uploadFile.status === "error" && (
          <div className="absolute top-2 right-2">
            <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
              <X className="h-3 w-3 text-white" />
            </div>
          </div>
        )}
      </div>
      <button
        onClick={() => onRemove(index)}
        className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="bg-black/50 rounded-full p-1">
          <X className="h-3 w-3 text-white" />
        </div>
      </button>
      <p className="text-xs text-muted-foreground mt-1 truncate">
        {uploadFile.file.name}
      </p>
      {uploadFile.status === "error" && uploadFile.error && (
        <p className="text-xs text-red-500 truncate">{uploadFile.error}</p>
      )}
    </motion.div>
  );
}
