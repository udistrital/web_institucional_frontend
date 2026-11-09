import "server-only";

import {
  absolutizarHtml,
  fetchJson,
  getPublicBaseUrl,
  getServerBaseUrl,
  resolveUrl,
} from "./api";
import type { NewsItem } from "@/types/domain";

export type { NewsItem };

/** Campo de texto con formato de Drupal (value/format/processed). */
type FormattedText = {
  value?: string | null;
  format?: string | null;
  processed?: string | null;
} | null;

type Resource = {
  id?: string;
  attributes?: {
    title?: string;
    created?: string;
    field_resumen?: string | null;
    field_descripcion?: FormattedText;
    field_fuente_de_informacion?: string | null;
    path?: { alias?: string | null } | null;
  };
  relationships?: {
    field_imagen?: { data?: { id?: string; meta?: { alt?: string } } | null } | null;
  };
};

type Response = { data?: Resource[]; included?: { type?: string; id?: string; attributes?: { uri?: { url?: string } } }[] };

const fallbackImage = "/image/vida universitaria.jpeg";

function mapNews(json: Response): NewsItem[] {
  const included = json.included ?? [];
  return (json.data ?? [])
    .map((resource, index) => {
      const imageRef = resource.relationships?.field_imagen?.data;
      const file = included.find(
        (item) => item.type === "file--file" && item.id === imageRef?.id,
      );
      const image = resolveUrl(file?.attributes?.uri?.url, getPublicBaseUrl());
      const resumen = resource.attributes?.field_resumen?.trim() || "";
      const descripcion = absolutizarHtml(
        resource.attributes?.field_descripcion?.processed?.trim() ||
          "",
      );
      return {
        id: resource.id || `news-${index}`,
        title: resource.attributes?.title || "Noticia",
        description: resumen || "Conoce más sobre esta noticia.",
        detail: descripcion,
        source: resource.attributes?.field_fuente_de_informacion?.trim() || "",
        image: image || fallbackImage,
        alt:
          imageRef?.meta?.alt ||
          resource.attributes?.title ||
          "Imagen de la noticia",
        publishedAt: resource.attributes?.created || new Date().toISOString(),
        href: resource.attributes?.path?.alias || "#noticias",
      };
    })
    .filter((item) => item.title && item.description);
}

function buildNewsUrl(limit: number): URL {
  const url = new URL("/jsonapi/node/news", getServerBaseUrl());
  url.searchParams.set("filter[status]", "1");
  url.searchParams.set("include", "field_imagen");
  // Más recientes primero (de la última publicación a la más antigua).
  url.searchParams.set("sort", "-created");
  url.searchParams.set("page[limit]", String(limit));
  return url;
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    const json = await fetchJson<Response>(buildNewsUrl(5));
    // Solo las 5 noticias más recientes. Si el backend respondió sin noticias,
    // devolvemos la lista vacía para que la UI muestre el mensaje de "no hay
    // noticias disponibles".
    return mapNews(json).slice(0, 5);
  } catch (error) {
    console.error("[Noticias] No se pudieron cargar las noticias:", error);
    return [];
  }
}

/**
 * Catálogo completo de noticias publicadas, usado por la página
 * "Noticias y eventos". A diferencia de {@link getNews}, no limita el número de
 * resultados para que los filtros puedan operar sobre toda la colección.
 */
export async function getAllNews(): Promise<NewsItem[]> {
  try {
    const json = await fetchJson<Response>(buildNewsUrl(50));
    return mapNews(json);
  } catch (error) {
    console.error("[Noticias] No se pudo cargar el catálogo de noticias:", error);
    return [];
  }
}
