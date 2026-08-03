"use client";

import { useMemo } from "react";

interface ExifHistogramProps {
  iso?: number;
  aperture?: string;
  shutter_speed?: string;
}

export function ExifHistogram({ iso = 100, aperture = "2.8", shutter_speed = "1/200" }: ExifHistogramProps) {
  // Generate smooth aesthetic histogram curves for RGB and Luminance
  const histogramData = useMemo(() => {
    // Generate 32 sample points simulating exposure curve
    const points = [];
    for (let i = 0; i < 32; i++) {
      const x = i / 31;
      // Bell curve formula centered near midtones
      const noise = Math.abs(Math.sin(i * 1.7)) * 10;
      const r = Math.sin(x * Math.PI) * 70 + noise;
      const g = Math.sin(x * Math.PI * 0.9 + 0.1) * 85 + noise * 0.8;
      const b = Math.sin(x * Math.PI * 1.1) * 65 + noise * 1.2;
      const lum = r * 0.3 + g * 0.59 + b * 0.11;
      points.push({ x: i * (280 / 31), r, g, b, lum });
    }
    return points;
  }, []);

  const pathR = `M 0 100 ` + histogramData.map(p => `L ${p.x} ${100 - p.r}`).join(" ") + ` L 280 100 Z`;
  const pathG = `M 0 100 ` + histogramData.map(p => `L ${p.x} ${100 - p.g}`).join(" ") + ` L 280 100 Z`;
  const pathB = `M 0 100 ` + histogramData.map(p => `L ${p.x} ${100 - p.b}`).join(" ") + ` L 280 100 Z`;
  const pathLum = `M 0 100 ` + histogramData.map(p => `L ${p.x} ${100 - p.lum}`).join(" ") + ` L 280 100 Z`;

  return (
    <div className="p-4 rounded-xl bg-card border border-border/60 glass-panel space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
        <span>HISTOGRAM</span>
        <span className="text-amber-500 font-semibold">ISO {iso} · f/{aperture} · {shutter_speed}s</span>
      </div>

      <div className="relative h-24 w-full bg-black/40 rounded-lg overflow-hidden border border-border/40 p-1">
        <svg viewBox="0 0 280 100" className="w-full h-full preserve-3d" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="70" y1="0" x2="70" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,2" />
          <line x1="140" y1="0" x2="140" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,2" />
          <line x1="210" y1="0" x2="210" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,2" />

          {/* Color channels */}
          <path d={pathR} fill="rgba(239, 68, 68, 0.25)" stroke="#ef4444" strokeWidth="1" />
          <path d={pathG} fill="rgba(34, 197, 94, 0.25)" stroke="#22c55e" strokeWidth="1" />
          <path d={pathB} fill="rgba(59, 130, 246, 0.25)" stroke="#3b82f6" strokeWidth="1" />
          <path d={pathLum} fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth="1.5" />
        </svg>

        <div className="absolute bottom-1 left-2 text-[9px] font-mono text-muted-foreground">Shadows</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground">Midtones</div>
        <div className="absolute bottom-1 right-2 text-[9px] font-mono text-muted-foreground">Highlights</div>
      </div>
    </div>
  );
}
