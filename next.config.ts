import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Listing photos are served straight from Airbnb's image CDN, which resizes
    // on the fly via `?im_w=`. The custom loader maps Next's requested widths
    // onto the widths that CDN actually serves (see src/lib/image-loader.ts).
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [720, 960, 1200, 1440, 1920, 2560],
    imageSizes: [120, 240, 320, 480],
    qualities: [75],
  },
};

export default nextConfig;
