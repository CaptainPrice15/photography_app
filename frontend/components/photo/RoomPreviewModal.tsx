"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { X, Frame, Maximize2, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RoomPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string;
  photoTitle: string;
}

const ROOM_BACKGROUNDS = [
  { id: "living", name: "Modern Living Room", bgClass: "bg-stone-900 border-stone-800" },
  { id: "studio", name: "Minimalist Gallery Wall", bgClass: "bg-zinc-950 border-zinc-900" },
  { id: "office", name: "Executive Suite", bgClass: "bg-neutral-900 border-neutral-800" },
];

const FRAME_OPTIONS = [
  { id: "black", name: "Matte Black Wood", borderStyle: "border-[14px] border-zinc-900 shadow-2xl" },
  { id: "gold", name: "Brushed Gold", borderStyle: "border-[14px] border-amber-600/80 shadow-[0_0_25px_rgba(212,175,55,0.3)]" },
  { id: "oak", name: "Natural Oak", borderStyle: "border-[14px] border-amber-900/60 shadow-2xl" },
  { id: "acrylic", name: "Frameless Acrylic Glass", borderStyle: "border-1 border-white/20 shadow-2xl" },
];

const PRINT_SIZES = [
  { id: "small", label: '12" × 18"', scale: "w-48 h-32", priceMultiplier: 1 },
  { id: "medium", label: '24" × 36"', scale: "w-72 h-48", priceMultiplier: 1.8 },
  { id: "large", label: '40" × 60"', scale: "w-96 h-64", priceMultiplier: 3.2 },
];

export function RoomPreviewModal({
  isOpen,
  onClose,
  photoUrl,
  photoTitle,
}: RoomPreviewModalProps) {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_BACKGROUNDS[0]);
  const [selectedFrame, setSelectedFrame] = useState(FRAME_OPTIONS[0]);
  const [selectedSize, setSelectedSize] = useState(PRINT_SIZES[1]);
  const [hasMat, setHasMat] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="relative z-10 w-full max-w-5xl rounded-3xl bg-card border border-border/80 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Main Visualizer Area */}
            <div className={`flex-1 relative flex flex-col items-center justify-center p-8 min-h-[380px] md:min-h-[500px] transition-colors duration-500 ${selectedRoom.bgClass}`}>
              {/* Room Lighting / Sofa Mockup Graphic */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

              {/* Framed Artwork Container */}
              <div
                className={`relative transition-all duration-500 ease-out flex items-center justify-center ${selectedSize.scale}`}
              >
                <div
                  className={`relative w-full h-full transition-all duration-300 ${selectedFrame.borderStyle} ${
                    hasMat ? "p-4 bg-stone-100 dark:bg-stone-900" : ""
                  }`}
                >
                  <div className="relative w-full h-full overflow-hidden shadow-inner">
                    <Image
                      src={photoUrl}
                      alt={photoTitle}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                </div>
              </div>

              {/* Sofa / Furniture Wall Silhouette Indicator */}
              <div className="absolute bottom-4 w-3/4 h-8 border-t-2 border-dashed border-white/10 flex items-center justify-center">
                <span className="text-[11px] font-mono text-muted-foreground/60 uppercase tracking-widest">
                  Wall Preview Context · {selectedSize.label}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-full md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Customizer Sidebar */}
            <div className="w-full md:w-80 p-6 border-t md:border-t-0 md:border-l border-border/60 glass-panel flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h3 className="font-heading font-bold text-lg">Wall Simulator</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hidden md:inline-flex rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Print Size Selection */}
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Print Sizing
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRINT_SIZES.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                          selectedSize.id === size.id
                            ? "border-amber-500 bg-amber-500/10 text-amber-500 font-bold shadow-xs"
                            : "border-border/60 hover:bg-muted"
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Frame Style Selection */}
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Frame Material
                  </label>
                  <div className="space-y-1.5">
                    {FRAME_OPTIONS.map((frame) => (
                      <button
                        key={frame.id}
                        onClick={() => setSelectedFrame(frame)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl border transition-all ${
                          selectedFrame.id === frame.id
                            ? "border-amber-500 bg-amber-500/10 text-amber-500 font-semibold"
                            : "border-border/40 hover:bg-muted"
                        }`}
                      >
                        <span>{frame.name}</span>
                        {selectedFrame.id === frame.id && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Matting Toggle */}
                <div className="mt-5 flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20">
                  <span className="text-xs font-medium">Off-White Passepartout Mat</span>
                  <button
                    onClick={() => setHasMat(!hasMat)}
                    className={`w-10 h-6 rounded-full transition-colors flex items-center p-0.5 ${
                      hasMat ? "bg-amber-500 justify-end" : "bg-muted justify-start"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                {/* Room Environment Selection */}
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Room Environment
                  </label>
                  <div className="space-y-1.5">
                    {ROOM_BACKGROUNDS.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className={`w-full text-left px-3 py-2 text-xs rounded-xl border transition-all ${
                          selectedRoom.id === room.id
                            ? "border-amber-500 bg-amber-500/10 text-amber-500 font-semibold"
                            : "border-border/40 hover:bg-muted"
                        }`}
                      >
                        {room.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/60 mt-6">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg shadow-amber-500/20">
                  Order Fine Art Print
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
