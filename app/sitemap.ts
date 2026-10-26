import type { MetadataRoute } from "next"
import { allowEmptyExport, getSitemapEntries } from "@/services/sitemap"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  try {
    return getSitemapEntries()
  } catch (error) {
    if (!allowEmptyExport()) throw error
    return []
  }
}
