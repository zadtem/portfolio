import type { MetadataRoute } from "next";
import { absoluteUrl, caseStudySlugs } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1
    },
    ...caseStudySlugs.map((slug) => ({
      url: absoluteUrl(`/work/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8
    }))
  ];
}
