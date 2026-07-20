import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WasteLens",
    short_name: "WasteLens",
    description: "Laporkan sampah, dapatkan koin, tukar reward.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F5",
    theme_color: "#1E7D38",
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
