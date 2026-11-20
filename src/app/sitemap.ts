import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://legalex.in";

  const practiceRoutes = siteConfig.practiceAreas.map((pa) => ({
    url: `${baseUrl}/practice-areas/${pa.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const staticRoutes = [
    "",
    "/about",
    "/practice-areas",
    "/case-results",
    "/insights",
    "/contact",
    "/book-consultation",
    "/verify-document",
    "/disclaimer",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  return [...staticRoutes, ...practiceRoutes];
}
