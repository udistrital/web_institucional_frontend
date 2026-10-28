import type { MetadataRoute } from "next"

type JsonApiArticle = {
  data?: {
    attributes?: {
      drupal_internal__nid?: number
      path?: { alias?: string | null }
    }
  }[]
  links?: { next?: { href?: string } | null }
}

const apiBaseUrl = process.env.DRUPAL_BASE_URL || "http://localhost:8080"
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const isDevelopment = process.env.NODE_ENV === "development"
const allowEmptyExport = process.env.ALLOW_EMPTY_EXPORT === "true"

export const dynamic = "force-static"

async function getArticleUrls(): Promise<string[]> {
  const urls: string[] = []
  let nextUrl: string | null = new URL(
    "/jsonapi/node/article?filter[status]=1&fields[node--article]=drupal_internal__nid,path&page[limit]=50",
    apiBaseUrl,
  ).toString()

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      ...(isDevelopment ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
    })

    if (!response.ok) {
      throw new Error(`Drupal respondió con HTTP ${response.status}`)
    }

    const json = (await response.json()) as JsonApiArticle

    for (const article of json.data ?? []) {
      const alias = article.attributes?.path?.alias
      const nid = article.attributes?.drupal_internal__nid
      const path = alias || (nid ? `/node/${nid}` : null)
      if (path) urls.push(new URL(path, siteUrl).toString())
    }

    nextUrl = json.links?.next?.href
      ? new URL(json.links.next.href, apiBaseUrl).toString()
      : null
  }

  return urls
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let articleUrls: string[] = []
  try {
    articleUrls = await getArticleUrls()
  } catch (error) {
    if (!allowEmptyExport) throw error
  }

  const staticUrls = [
    "/",
    "/acerca-de/",
    "/nuestra-universidad/calendario-academico/",
  ].map((path) => new URL(path, siteUrl).toString())

  return [...staticUrls, ...articleUrls].map((url) => ({
    url,
    changeFrequency: "daily" as const,
  }))
}
