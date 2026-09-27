import type { Metadata, Viewport } from "next";
import { listing } from "@/data/listing";
import "./globals.css";

export const metadata: Metadata = {
  title: `${listing.title} - ${listing.seoSubtitle} - Airbnb`,
  description: listing.description[0]?.body.slice(0, 160),
  icons: {
    icon: "https://a0.muscache.com/im/pictures/AirbnbPlatformAssets/AirbnbPlatformAssets-Favicons/original/d1fcc0b3-865f-485a-b28b-43ca0bf7c891.png?im_w=240",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://a0.muscache.com" crossOrigin="" />
      </head>
      <body>{children}</body>
    </html>
  );
}
