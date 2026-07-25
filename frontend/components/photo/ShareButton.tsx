"use client";

import { Share2, Link2, Mail, Send, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  photoId: string;
  title: string;
  url?: string;
}

export function ShareButton({ photoId, title, url }: ShareButtonProps) {
  const shareUrl = url || `${typeof window !== "undefined" ? window.location.origin : ""}/gallery/${photoId}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shareUrl);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this photo: ${title}`);
    const body = encodeURIComponent(`I found this amazing photo and thought you'd like it: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out "${title}" - ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="lg">
          <Share2 className="h-5 w-5 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyToClipboard}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaEmail}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnTwitter}>
          <Send className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnFacebook}>
          <Globe className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
