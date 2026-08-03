"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, ShoppingCart, User, Heart, LogOut, ChevronDown, Camera, HelpCircle, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { CartSidebar } from "@/components/cart";
import { KeyboardShortcutsModal } from "@/components/shared";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Global Keyboard Navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keybindings if typing in an input/textarea
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName)) return;

      if (e.key === "?") {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setIsCartOpen((prev) => !prev);
      } else if (e.key === "g" || e.key === "G") {
        e.preventDefault();
        router.push("/gallery");
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        router.push("/map");
      } else if (e.key === "f" || e.key === "F") {
        if (isAuthenticated) {
          e.preventDefault();
          router.push("/favourites");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthenticated, router]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-border/40 backdrop-blur-md bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300">
              <Camera className="h-5 w-5" />
            </div>
            <span className="font-heading font-bold text-2xl tracking-tight">
              Photo<span className="gold-gradient-text">Exhibit</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-amber-500 relative py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/map"
              className="text-sm font-medium transition-colors hover:text-amber-500 flex items-center gap-1.5"
            >
              <Map className="h-3.5 w-3.5 text-amber-500" />
              <span>Map</span>
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Keyboard Shortcuts button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-muted-foreground hover:text-amber-500"
              onClick={() => setIsShortcutsOpen(true)}
              title="Keyboard Shortcuts (?)"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Shortcuts</span>
            </Button>

            <ThemeToggle />

            {/* Favourites */}
            {isAuthenticated && (
              <Link href="/favourites">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:text-rose-500">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Favourites</span>
                </Button>
              </Link>
            )}

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 relative rounded-full hover:text-amber-500"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-amber-500 text-black font-bold border border-background">
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>

            {/* Auth Menu */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-full text-sm font-medium h-9 px-3 gap-2 border border-border/60 hover:border-amber-500/50 hover:bg-amber-500/10 transition-colors cursor-pointer">
                      <User className="h-4 w-4 text-amber-500" />
                      <span className="hidden sm:inline font-medium">{user?.username}</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 glass-panel border border-border/80">
                      <DropdownMenuItem>
                        <Link href="/profile" className="w-full">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/profile/orders" className="w-full">Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/collections" className="w-full">Collections</Link>
                      </DropdownMenuItem>
                      {user?.role === "admin" && (
                        <DropdownMenuItem className="text-amber-500 font-semibold">
                          <Link href="/admin" className="w-full">Admin Dashboard</Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-400">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2 ml-1">
                    <Link href="/login">
                      <Button variant="ghost" size="sm" className="rounded-full">Login</Button>
                    </Link>
                    <Link href="/register">
                      <Button size="sm" className="rounded-full bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-md shadow-amber-500/15">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Mobile Navigation Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-full h-9 w-9 hover:bg-accent hover:text-accent-foreground cursor-pointer">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] glass-panel border-l border-border">
                <div className="flex items-center gap-2 mb-6 pt-4">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                    <Camera className="h-5 w-5" />
                  </div>
                  <span className="font-heading font-bold text-xl">PhotoExhibit</span>
                </div>
                <nav className="flex flex-col gap-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-medium transition-colors hover:text-amber-500 border-b border-border/30 pb-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/map"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-amber-500 flex items-center gap-2 border-b border-border/30 pb-2"
                  >
                    <Map className="h-4 w-4 text-amber-500" />
                    <span>Map View</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </>
  );
}
