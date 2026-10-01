import "server-only";

import {
  getFetchOptions,
  resolvePublicAssetUrl,
  resolveServerBaseUrl,
} from "@/services/drupal-client";
import type {
  Articulo,
  ArticuloParam,
  ArticuloResult,
} from "@/services/articles.types";

/**
 * Servicio de artículos de la Capa_Servicios.
 *
 * Aísla toda la interacción de red y el conocimiento de la estructura JSON:API
 * de Drupal, entregando a los componentes únicamente interfaces planas
 * (`Articulo`) y una señalización de resultado tipada (`ArticuloResult`).
 *
 * Los tipos JSON:API y el mapper son privados a este módulo.
 */

const isDevelopment = process.env.NODE_ENV === "development";

/** Recurso de artículo tal como lo devuelve Drupal vía JSON:API. */
interface JsonApiArticleResource {
  id: string;
  attributes: {
    title: string;
    body?: { processed?: string } | null;
    created: string;
  };
  relationships?: {
    field_poster?: {
      data?: { id: string; meta?: { alt?: string } } | null;
    };
  };
}

/** Recurso incluido (archivo/póster) referenciado por un artículo. */
interface JsonApiIncludedResource {
  type: string;
  id: string;
  attributes?: { changed?: string; uri?: { url?: string } };
}

/** Respuesta JSON:API para la obtención de un artículo con su póster. */
interface JsonApiArticleResponse {
  data?: JsonApiArticleResource[];
  included?: JsonApiIncludedResource[];
}

/** Recurso de la colección usada para `generateStaticParams`. */
interface JsonApiArticlePathResource {
  attributes?: {
    drupal_internal__nid?: number;
    path?: { alias?: string | null };
  };
}

/** Respuesta JSON:API de la colección de rutas de artículos. */
interface JsonApiArticleCollection {
  data?: JsonApiArticlePathResource[];
}

/**
 * Resuelve la URL pública absoluta del póster a partir de su ruta relativa.
 * En desarrollo añade un parámetro de versión (`v`) para evitar imágenes
 * cacheadas tras un cambio. Devuelve `null` cuando no hay póster.
 */
function resolvePosterUrl(
  posterPath: string | undefined,
  changed: string | undefined,
): string | null {
  if (!posterPath) return null;

  const resolved = resolvePublicAssetUrl(posterPath);
  if (!isDevelopment || !changed) return resolved;

  try {
    const url = new URL(resolved);
    url.searchParams.set("v", changed);
    return url.toString();
  } catch {
    return resolved;
  }
}

/**
 * Mapper puro y privado: transforma un recurso JSON:API de artículo (más sus
 * recursos incluidos) en la interface plana `Articulo`, sin filtrar ninguna
 * estructura de JSON:API.
 */
function mapArticleResource(
  resource: JsonApiArticleResource,
  included: JsonApiIncludedResource[],
): Articulo {
  const posterReference = resource.relationships?.field_poster?.data;
  const poster = included.find(
    (item) => item.type === "file--file" && item.id === posterReference?.id,
  );

  const posterUrl = resolvePosterUrl(
    poster?.attributes?.uri?.url,
    poster?.attributes?.changed,
  );

  return {
    id: resource.id,
    title: resource.attributes.title,
    bodyHtml: resource.attributes.body?.processed ?? null,
    createdAt: resource.attributes.created,
    posterUrl,
    posterAlt: posterReference?.meta?.alt ?? resource.attributes.title,
  };
}

/**
 * Obtiene un artículo por su `slug` de ruta. El `slug` puede ser un alias de
 * Drupal o la forma `["node", "<nid>"]`.
 *
 * Devuelve una señalización tipada:
 * - `{ status: "ok", articulo }` si se encontró,
 * - `{ status: "not-found" }` si no existe,
 * - `{ status: "error" }` ante cualquier fallo de red o respuesta inválida.
 *
 * No lanza excepciones ni expone la estructura JSON:API.
 */
export async function getArticleBySlug(slug: string[]): Promise<ArticuloResult> {
  if (slug.length === 1 && slug[0] === "__no-content__") {
    return { status: "not-found" };
  }

  const nodeId = slug.length === 2 && slug[0] === "node" ? slug[1] : null;

  const articleUrl = new URL(
    `${resolveServerBaseUrl()}/jsonapi/node/article`,
  );
  articleUrl.searchParams.set("include", "field_poster");
  if (nodeId && /^\d+$/.test(nodeId)) {
    articleUrl.searchParams.set("filter[drupal_internal__nid]", nodeId);
  } else {
    articleUrl.searchParams.set("filter[path.alias]", `/${slug.join("/")}`);
  }

  try {
    const response = await fetch(articleUrl, getFetchOptions());
    if (!response.ok) return { status: "not-found" };

    const json = (await response.json()) as JsonApiArticleResponse;
    const resource = json.data?.[0];
    if (!resource) return { status: "not-found" };

    const articulo = mapArticleResource(resource, json.included ?? []);
    return { status: "ok", articulo };
  } catch {
    return { status: "error" };
  }
}

/**
 * Obtiene los parámetros de ruta para `generateStaticParams`. Devuelve la lista
 * de `slug` de los artículos publicados.
 *
 * Preserva el comportamiento de exportación estática original: si Drupal no
 * devuelve artículos y `ALLOW_EMPTY_EXPORT` no está activo, lanza para fallar
 * la exportación; si está activo, devuelve el marcador `__no-content__`.
 */
export async function getArticleParams(): Promise<ArticuloParam[]> {
  const allowEmptyExport = process.env.ALLOW_EMPTY_EXPORT === "true";

  try {
    const response = await fetch(
      `${resolveServerBaseUrl()}/jsonapi/node/article?filter[status]=1&fields[node--article]=drupal_internal__nid,path`,
      { cache: "force-cache" },
    );
    if (!response.ok) {
      throw new Error(`Drupal respondio con HTTP ${response.status}`);
    }

    const json = (await response.json()) as JsonApiArticleCollection;
    const paths = (json.data ?? [])
      .map((article): ArticuloParam | null => {
        const alias = article.attributes?.path?.alias;
        const nid = article.attributes?.drupal_internal__nid;
        if (alias) return { slug: alias.split("/").filter(Boolean) };
        if (nid) return { slug: ["node", String(nid)] };
        return null;
      })
      .filter((path): path is ArticuloParam => path !== null);

    if (paths.length || allowEmptyExport) {
      return paths.length ? paths : [{ slug: ["__no-content__"] }];
    }
    throw new Error("Drupal no devolvio articulos para la exportacion estatica");
  } catch {
    if (allowEmptyExport) return [{ slug: ["__no-content__"] }];
    throw new Error("Drupal no esta disponible para la exportacion estatica");
  }
}
