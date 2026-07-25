import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "PhotoExhibit - Photography Portfolio & Marketplace",
    template: "%s | PhotoExhibit",
  },
  description: "Showcase, organize, and sell your photography. Browse stunning photographs, collections, and exhibitions.",
  keywords: ["photography", "photos", "gallery", "exhibition", "portfolio", "marketplace"],
  authors: [{ name: "PhotoExhibit" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PhotoExhibit",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
