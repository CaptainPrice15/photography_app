"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingCart, User, Heart, LogOut, ChevronDown, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { NAV_LINKS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-strong">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Camera className="h-6 w-6" />
          <span>PhotoExhibit</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Favourites */}
          {isAuthenticated && (
            <Link href="/favourites">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Favourites</span>
              </Button>
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <ShoppingCart className="h-4 w-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          {/* Auth */}
          {!isLoading && (
            <>
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-3 gap-2 hover:bg-accent hover:text-accent-foreground cursor-pointer">
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline">{user?.username}</span>
                      <ChevronDown className="h-3 w-3" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
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
                      <DropdownMenuItem>
                        <Link href="/admin" className="w-full">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={logout} className="text-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden inline-flex items-center justify-center rounded-md h-9 w-9 hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
