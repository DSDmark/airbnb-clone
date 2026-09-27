"use client";

import type { ImageLoaderProps } from "next/image";

/** Widths the a0.muscache.com resizer accepts; anything else 404s. */
export const CDN_WIDTHS = [120, 240, 320, 480, 720, 960, 1200, 1440, 1920, 2560] as const;

const CDN_HOST = "a0.muscache.com";

export function cdnWidth(requested: number): number {
  return CDN_WIDTHS.find((w) => w >= requested) ?? CDN_WIDTHS[CDN_WIDTHS.length - 1];
}

export default function imageLoader({ src, width }: ImageLoaderProps): string {
  if (!src.includes(CDN_HOST)) return src;
  const url = new URL(src);
  url.searchParams.set("im_w", String(cdnWidth(width)));
  return url.toString();
}
