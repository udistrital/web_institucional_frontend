import "server-only";

import type { MetadataRoute } from "next";

const publicRoutes = [
  "/",
  "/acerca-de/",
  "/facultades/",
  "/facultades/artes-asab/",
  "/facultades/artes-asab/extension/",
  "/facultades/ciencias-educacion/",
  "/facultades/ciencias-matematicas-naturales/",
  "/facultades/ciencias-salud/",
  "/facultades/ingenieria/",
  "/facultades/medio-ambiente-recursos-naturales/",
  "/facultades/tecnologica/",
  "/nuestra-universidad/calendario-academico/",
  "/perfiles/",
  "/perfiles/administrativos/",
  "/perfiles/aspirantes/",
  "/perfiles/educadores/",
  "/perfiles/estudiantes/",
  "/ti/",
] as const;

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function allowEmptyExport(): boolean {
  return process.env.ALLOW_EMPTY_EXPORT === "true";
}

export function getSitemapEntries(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return publicRoutes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    changeFrequency: "daily" as const,
  }));
}
