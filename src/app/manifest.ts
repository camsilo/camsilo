import type { MetadataRoute } from "next";

// Web App Manifest — gør Camsilo installérbart som PWA.
// Next.js linker selv dette fra <head> (route: /manifest.webmanifest).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Camsilo — Odin",
    short_name: "Camsilo",
    description: "Camsilo admin & kommandocenter",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#0d0b09",
    theme_color: "#0d0b09",
    lang: "da",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Admin",
        short_name: "Admin",
        description: "Åbn admin-konsollen",
        url: "/admin",
      },
    ],
  };
}
