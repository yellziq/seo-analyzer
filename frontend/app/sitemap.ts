import type { MetadataRoute } from "next";

const routes = [
  "",
  "/auth/login",
  "/auth/register",
  "/profile",
  "/analyze",
  "/history",
  "/reports",
  "/settings",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `http://localhost:3000${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
