import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fontHeading = Cormorant_Garamond({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://photography-app-q4be.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PhotoExhibit - Photography Portfolio & Marketplace",
    template: "%s | PhotoExhibit",
  },
  description:
    "Showcase, organize, and sell your photography. Browse stunning photographs, curated collections, and virtual exhibitions.",
  keywords: [
    "photography",
    "photos",
    "gallery",
    "exhibition",
    "portfolio",
    "marketplace",
    "fine art photography",
    "photo prints",
  ],
  authors: [{ name: "PhotoExhibit" }],
  creator: "PhotoExhibit",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PhotoExhibit",
    title: "PhotoExhibit - Photography Portfolio & Marketplace",
    description:
      "Showcase, organize, and sell your photography. Browse stunning photographs, curated collections, and virtual exhibitions.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "PhotoExhibit - Photography Portfolio & Marketplace",
    description:
      "Showcase, organize, and sell your photography. Browse stunning photographs, curated collections, and virtual exhibitions.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fontHeading.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
