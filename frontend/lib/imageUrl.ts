import { API_URL } from "./constants";
import type { Photo } from "./types";

function toAbsolute(path?: string | null): string {
  if (!path) return "/images/placeholder.jpg";
  if (/^https?:\/\//.test(path)) return path;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getPreviewUrl(
  photo: Partial<Pick<Photo, "preview_url" | "download_url">> | null | undefined
): string {
  return toAbsolute(photo?.preview_url || photo?.download_url);
}
