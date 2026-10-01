import "server-only";

import {
  getFetchOptions,
  resolvePublicAssetUrl,
  resolveServerBaseUrl,
} from "@/services/drupal-client";
import type { NewsItem, NewsResult } from "@/services/news.types";

/**
 * Servicio de noticias de la Capa_Servicios.
 *
 * Encapsula toda la interacción con Drupal JSON:API para el nodo `news`:
 * construye la petición, transforma la respuesta anidada en `NewsItem`
 * planos y señaliza los fallos mediante `NewsResult.hasError` sin exponer
 * jamás la estructura JSON:API ni lanzar excepciones a los consumidores.
 */

// --- Tipos JSON:API privados (no se exportan) ---

interface DrupalNewsResource {
  id?: string;
  attributes?: {
    title?: string;
    field_resumen?: string | null;
    path?: {
      alias?: string | null;
    } | null;
  };
  relationships?: {
    field_imagen?: {
      data?: {
        id?: string;
        meta?: {
          alt?: string;
          title?: string;
        };
      } | null;
    } | null;
  };
}

interface DrupalIncludedItem {
  type?: string;
  id?: string;
  attributes?: {
    uri?: {
      url?: string;
    };
  };
}

interface DrupalNewsResponse {
  data?: DrupalNewsResource[];
  included?: DrupalIncludedItem[];
}

/**
 * Imagen de reserva usada cuando una noticia no tiene imagen resoluble.
 * Es un asset local público, no una estructura JSON:API.
 */
const FALLBACK_IMAGE = "/image/vida universitaria.jpeg";

/**
 * Resuelve la URL pública absoluta de la imagen de una noticia a partir de
 * su relación `field_imagen` y los recursos `included`. Devuelve `null` si no
 * hay imagen resoluble. Función pura.
 */
function resolveNewsImageUrl(
  resource: DrupalNewsResource,
  included: DrupalIncludedItem[],
): string | null {
  const imageReference = resource.relationships?.field_imagen?.data;
  if (!imageReference?.id) return null;

  const fileItem = included.find(
    (item) => item.type === "file--file" && item.id === imageReference.id,
  );

  const relativeImagePath = fileItem?.attributes?.uri?.url;
  if (!relativeImagePath) return null;

  return resolvePublicAssetUrl(relativeImagePath);
}

/**
 * Mapper puro y privado: transforma un recurso JSON:API de noticia en un
 * `NewsItem` plano. No accede a red ni muta sus entradas, y solo produce las
 * claves definidas por la interface `NewsItem`.
 */
function mapNewsResource(
  resource: DrupalNewsResource,
  included: DrupalIncludedItem[],
  index: number,
): NewsItem {
  const title = resource.attributes?.title || "Noticia";
  const description =
    resource.attributes?.field_resumen || "Conoce más sobre esta noticia.";
  const image = resolveNewsImageUrl(resource, included);
  const alt =
    resource.relationships?.field_imagen?.data?.meta?.alt ||
    resource.attributes?.title ||
    "Imagen de la noticia";
  const href = resource.attributes?.path?.alias || null;

  return {
    id: resource.id || `news-${index}`,
    title,
    description,
    image: image || FALLBACK_IMAGE,
    alt,
    href,
  };
}

/**
 * Obtiene las noticias publicadas desde Drupal JSON:API y las devuelve como
 * interfaces planas. Ante cualquier fallo (red, respuesta no OK o parseo)
 * devuelve `{ items: [], hasError: true }` sin lanzar ni exponer JSON:API.
 */
export async function getNews(): Promise<NewsResult> {
  const apiUrl = new URL("/jsonapi/node/news", resolveServerBaseUrl());
  apiUrl.searchParams.set("filter[status]", "1");
  apiUrl.searchParams.set("include", "field_imagen");
  apiUrl.searchParams.set("sort", "-created");
  apiUrl.searchParams.set("page[limit]", "3");

  try {
    const response = await fetch(apiUrl.toString(), getFetchOptions());

    if (!response.ok) {
      console.error(
        `[Drupal Error] Status: ${response.status} en la URL: ${apiUrl.toString()}`,
      );
      return { items: [], hasError: true };
    }

    const json = (await response.json()) as DrupalNewsResponse;
    const included = json.included ?? [];

    const items = (json.data ?? [])
      .map((resource, index) => mapNewsResource(resource, included, index))
      .filter((item) => item.title && item.description)
      .slice(0, 3);

    return { items, hasError: false };
  } catch (error) {
    console.error("[Fetch Error] No se pudo conectar con Drupal:", error);
    return { items: [], hasError: true };
  }
}
