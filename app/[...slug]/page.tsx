import { notFound } from "next/navigation"

import { Article } from "@/components/article"
import { getArticleBySlug, getArticleParams } from "@/services/articles"

export const dynamicParams = false

export async function generateStaticParams() {
  return getArticleParams()
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const result = await getArticleBySlug(slug)
  if (result.status !== "ok") notFound()

  return <Article articulo={result.articulo} />
}
