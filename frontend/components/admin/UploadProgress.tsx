"use client";

import { motion } from "motion/react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UploadFile {
  file: File;
  preview: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

interface UploadProgressProps {
  files: UploadFile[];
}

const STATUS_CONFIG = {
  pending: { label: "Pending", variant: "secondary" as const, icon: null },
  uploading: { label: "Uploading", variant: "default" as const, icon: Loader2 },
  success: { label: "Done", variant: "default" as const, icon: CheckCircle },
  error: { label: "Failed", variant: "destructive" as const, icon: AlertCircle },
};

export function UploadProgress({ files }: UploadProgressProps) {
  const completed = files.filter((f) => f.status === "success").length;
  const failed = files.filter((f) => f.status === "error").length;
  const uploading = files.filter((f) => f.status === "uploading").length;
  const pending = files.filter((f) => f.status === "pending").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">
          {files.length} file(s)
        </span>
        {completed > 0 && (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {completed} done
          </Badge>
        )}
        {uploading > 0 && (
          <Badge variant="default">
            {uploading} uploading
          </Badge>
        )}
        {pending > 0 && (
          <Badge variant="secondary">{pending} pending</Badge>
        )}
        {failed > 0 && (
          <Badge variant="destructive">{failed} failed</Badge>
        )}
      </div>

      <div className="space-y-2">
        {files.map((file, index) => {
          const config = STATUS_CONFIG[file.status];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 rounded-md border p-2"
            >
              <div className="h-10 w-10 rounded bg-muted overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element -- blob preview URL cannot use next/image */}
                <img
                  src={file.preview}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              {file.status === "uploading" && (
                <div className="w-24">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${file.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    {file.progress}%
                  </p>
                </div>
              )}
              <Badge variant={config.variant} className="flex-shrink-0">
                {config.icon && (
                  <config.icon
                    className={`h-3 w-3 mr-1 ${
                      file.status === "uploading" ? "animate-spin" : ""
                    }`}
                  />
                )}
                {config.label}
              </Badge>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
