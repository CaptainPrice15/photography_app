"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WatermarkPreviewProps {
  imageUrl?: string;
  watermarkText?: string;
  opacity?: number;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  scale?: number;
  onOpacityChange?: (value: number) => void;
  onPositionChange?: (position: string) => void;
  onScaleChange?: (value: number) => void;
}

const POSITION_STYLES: Record<string, string> = {
  "top-left": "top-4 left-4",
  "top-right": "top-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "bottom-right": "bottom-4 right-4",
  center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

const POSITIONS = ["top-left", "top-right", "center", "bottom-left", "bottom-right"] as const;

export function WatermarkPreview({
  imageUrl,
  watermarkText = "PhotoExhibit",
  opacity = 30,
  position = "bottom-right",
  scale = 100,
  onOpacityChange,
  onPositionChange,
  onScaleChange,
}: WatermarkPreviewProps) {
  const [previewOpacity, setPreviewOpacity] = useState(opacity);
  const [previewPosition, setPreviewPosition] = useState<string>(position);
  const [previewScale, setPreviewScale] = useState(scale);

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(100, Math.max(0, Number(e.target.value)));
    setPreviewOpacity(val);
    onOpacityChange?.(val);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(200, Math.max(10, Number(e.target.value)));
    setPreviewScale(val);
    onScaleChange?.(val);
  };

  const handlePositionChange = (pos: string) => {
    setPreviewPosition(pos);
    onPositionChange?.(pos);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Watermark Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- raw preview URL rendered as-is
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image selected
                </div>
              )
            }            <div
              className={`absolute ${POSITION_STYLES[previewPosition]} pointer-events-none`}
              style={{ opacity: previewOpacity / 100 }}
            >
              <span
                className="text-white font-bold drop-shadow-lg whitespace-nowrap"
                style={{ fontSize: `${previewScale * 0.12}rem` }}
              >
                {watermarkText}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wm-opacity">Opacity ({previewOpacity}%)</Label>
              <Input
                id="wm-opacity"
                type="range"
                min={0}
                max={100}
                step={5}
                value={previewOpacity}
                onChange={handleOpacityChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wm-scale">Scale ({previewScale}%)</Label>
              <Input
                id="wm-scale"
                type="range"
                min={10}
                max={200}
                step={10}
                value={previewScale}
                onChange={handleScaleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <div className="grid grid-cols-3 gap-1">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => handlePositionChange(pos)}
                    className={`text-xs px-2 py-1 rounded border ${
                      previewPosition === pos
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-muted"
                    }`}
                  >
                    {pos.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
