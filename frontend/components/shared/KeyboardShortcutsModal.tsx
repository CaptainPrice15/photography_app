"use client";

import { motion, AnimatePresence } from "motion/react";
import { Command, X, Search, Image as ImageIcon, Heart, ShoppingBag, Map, HelpCircle, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Shortcut {
  key: string;
  description: string;
  icon?: LucideIcon;
}

const SHORTCUTS: Shortcut[] = [
  { key: "?", description: "Toggle Shortcuts Helper", icon: HelpCircle },
  { key: "/", description: "Focus Gallery Search", icon: Search },
  { key: "G", description: "Go to Main Gallery", icon: ImageIcon },
  { key: "M", description: "Open Photo Map View", icon: Map },
  { key: "F", description: "Go to Favourites", icon: Heart },
  { key: "C", description: "View Shopping Cart", icon: ShoppingBag },
  { key: "Esc", description: "Close Modals / Lightbox", icon: X },
];

export function KeyboardShortcutsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-card border border-border/80 p-6 shadow-2xl glass-panel"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Command className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold">Keyboard Shortcuts</h3>
                  <p className="text-xs text-muted-foreground">Quick navigation & action controls</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="py-4 space-y-3">
              {SHORTCUTS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {IconComponent && <IconComponent className="h-4 w-4 text-amber-500" />}
                      <span className="text-sm font-medium">{item.description}</span>
                    </div>
                    <kbd className="px-2.5 py-1 text-xs font-mono font-semibold bg-background border border-border rounded-md shadow-xs text-amber-500">
                      {item.key}
                    </kbd>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-border/40 text-center text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-muted rounded">Esc</kbd> anytime to dismiss overlays.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
