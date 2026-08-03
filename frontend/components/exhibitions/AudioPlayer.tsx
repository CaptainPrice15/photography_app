"use client";

import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AudioPlayerProps {
  title?: string;
  artist?: string;
}

export function AudioPlayer({
  title = "Ambient Gallery Soundscape",
  artist = "Curated Exhibition Commentary",
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950/80 border border-white/10 glass-panel shadow-2xl text-white">
      <Button
        size="icon"
        className="rounded-full bg-amber-500 text-black hover:bg-amber-400 h-10 w-10 shrink-0 shadow-lg shadow-amber-500/20"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </Button>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2">
          <Headphones className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <h4 className="font-heading font-semibold text-sm truncate">{title}</h4>
          {isPlaying && (
            <Badge className="bg-amber-500/20 text-amber-400 text-[10px] animate-pulse">
              NOW PLAYING
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{artist}</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-white hover:bg-white/10 rounded-full h-8 w-8 shrink-0"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
