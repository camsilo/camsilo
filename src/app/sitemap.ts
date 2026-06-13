import type { MetadataRoute } from "next";

const BASE = "https://camsilo.dk";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
