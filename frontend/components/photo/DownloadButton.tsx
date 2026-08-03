"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, Lock, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface DownloadButtonProps {
  photoId: string;
  isFree: boolean;
  price?: number;
  onDownload?: (photoId: string) => void;
}

interface Entitlement {
  photo_id: string;
  is_free: boolean;
  is_admin: boolean;
  purchased: boolean;
}

export function DownloadButton({
  photoId,
  isFree,
  price,
}: DownloadButtonProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const checkEntitlement = async () => {
      try {
        const { data } = await api.get(`/photos/${photoId}/entitlement`);
        if (!cancelled) setEntitlement(data);
      } catch {
        // ignore - fall back to free state
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    };
    checkEntitlement();
    return () => {
      cancelled = true;
    };
  }, [photoId, isAuthenticated]);

  const handleDownload = useCallback(async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/gallery/${photoId}`)}`);
      return;
    }
    if (entitlement && !entitlement.purchased) {
      router.push("/cart");
      return;
    }

    setIsDownloading(true);
    try {
      const { data } = await api.get(`/photos/${photoId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `photo-${photoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        router.push("/cart");
      }
    } finally {
      setIsDownloading(false);
    }
  }, [isAuthenticated, entitlement, photoId, router]);

  if (isChecking || authLoading) {
    return (
      <Button variant="outline" size="lg" disabled>
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Checking...
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        size="lg"
        onClick={() =>
          router.push(`/login?next=${encodeURIComponent(`/gallery/${photoId}`)}`)
        }
      >
        <LogIn className="h-5 w-5 mr-2" />
        Login to Download
      </Button>
    );
  }

  if (isFree || entitlement?.purchased) {
    return (
      <Button
        variant="outline"
        size="lg"
        disabled={isDownloading}
        onClick={handleDownload}
      >
        {isDownloading ? (
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
        ) : (
          <Download className="h-5 w-5 mr-2" />
        )}
        {isFree ? "Download Free" : "Download Original"}
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={() => router.push("/cart")}
      className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
    >
      <Lock className="h-5 w-5 mr-2" />
      {price ? `Buy for ${formatCurrency(price)}` : "Purchase Required"}
    </Button>
  );
}
