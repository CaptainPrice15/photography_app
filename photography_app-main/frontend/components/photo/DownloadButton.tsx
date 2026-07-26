"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  photoId: string;
  isFree: boolean;
  onDownload?: (photoId: string) => void;
}

export function DownloadButton({
  photoId,
  isFree,
  onDownload,
}: DownloadButtonProps) {
  if (!isFree) {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => onDownload?.(photoId)}
    >
      <Download className="h-5 w-5 mr-2" />
      Download Free
    </Button>
  );
}
