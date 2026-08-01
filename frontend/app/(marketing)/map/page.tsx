import { PhotoMap } from "@/components/map/PhotoMap";

export const metadata = {
  title: "Geo-Location Photo Map",
  description: "Explore photography shoot locations geographically around the world.",
};

export default function MapPage() {
  return <PhotoMap />;
}
