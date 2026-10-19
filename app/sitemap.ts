import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const dynamic = "force-static"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = ["/", "/acerca-de/"].map((path) =>
    new URL(path, siteUrl).toString(),
  )

  return staticUrls.map((url) => ({
    url,
    changeFrequency: "daily" as const,
  }))
}
