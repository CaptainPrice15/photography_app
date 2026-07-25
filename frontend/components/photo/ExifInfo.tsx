"use client";

import { Camera, Aperture, Timer, Gauge, Calendar } from "lucide-react";

interface ExifInfoProps {
  camera_make?: string;
  camera_model?: string;
  lens?: string;
  focal_length?: string;
  aperture?: string;
  shutter_speed?: string;
  iso?: number;
  taken_at?: string;
}

export function ExifInfo({
  camera_make,
  camera_model,
  lens,
  focal_length,
  aperture,
  shutter_speed,
  iso,
  taken_at,
}: ExifInfoProps) {
  const hasData = camera_make || camera_model || lens || focal_length || aperture || shutter_speed || iso;

  if (!hasData) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium flex items-center gap-2">
        <Camera className="h-4 w-4" />
        Camera Information
      </h4>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {(camera_make || camera_model) && (
          <div>
            <p className="text-muted-foreground">Camera</p>
            <p className="font-medium">
              {camera_make} {camera_model}
            </p>
          </div>
        )}
        {lens && (
          <div>
            <p className="text-muted-foreground">Lens</p>
            <p className="font-medium">{lens}</p>
          </div>
        )}
        {focal_length && (
          <div className="flex items-center gap-2">
            <div>
              <p className="text-muted-foreground">Focal Length</p>
              <p className="font-medium">{focal_length}</p>
            </div>
          </div>
        )}
        {aperture && (
          <div className="flex items-center gap-2">
            <Aperture className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Aperture</p>
              <p className="font-medium">f/{aperture}</p>
            </div>
          </div>
        )}
        {shutter_speed && (
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Shutter Speed</p>
              <p className="font-medium">{shutter_speed}s</p>
            </div>
          </div>
        )}
        {iso && (
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">ISO</p>
              <p className="font-medium">{iso}</p>
            </div>
          </div>
        )}
        {taken_at && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Date Taken</p>
              <p className="font-medium">
                {new Date(taken_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
