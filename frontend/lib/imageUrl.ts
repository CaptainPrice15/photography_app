import { API_URL } from "./constants";

function toAbsolute(path?: string | null): string {
  if (!path) return "/images/placeholder.jpg";
  if (/^https?:\/\//.test(path)) return path;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getPreviewUrl(
  photo: { preview_url?: string; download_url?: string; src?: string } | null | undefined
): string {
  return toAbsolute(photo?.preview_url || photo?.download_url || photo?.src);
}
