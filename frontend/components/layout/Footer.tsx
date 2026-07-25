import Link from "next/link";
import { Camera, Globe, Link2, Mail, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Camera className="h-6 w-6" />
              <span>PhotoExhibit</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Showcasing the world through photography. Browse, collect, and purchase stunning photographs.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Gallery
              </Link>
              <Link href="/albums" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Albums
              </Link>
              <Link href="/exhibitions" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Exhibitions
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="font-semibold">Follow</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Link2 className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} PhotoExhibit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
