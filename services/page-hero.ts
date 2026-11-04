import "server-only";

import type { PageHeroData } from "@/components/common/page-hero/types";
import { fetchJson, getPublicBaseUrl, getServerBaseUrl, resolveUrl } from "./api";

type DrupalImageReference = {
  id?: string;
  meta?: { alt?: string };
} | null;

type DrupalPageHeroResource = {
  id?: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, { data?: DrupalImageReference } | null>;
};

type DrupalFileResource = {
  type?: string;
  id?: string;
  attributes?: { uri?: { url?: string } };
};

type DrupalPageHeroResponse = {
  data?: DrupalPageHeroResource[];
  included?: DrupalFileResource[];
};

export type DrupalPageHeroOptions = {
  /** Bundle JSON:API, por ejemplo `pagina_informativa`. */
  contentType: string;
  /** Nombre de la relación de imagen configurada en Drupal. */
  imageField: string;
  /** Nombre del atributo de título; por defecto `title`. */
  titleField?: string;
  /** Filtros JSON:API adicionales, por ejemplo `filter[path.alias]`. */
  filters?: Record<string, string>;
  /** Datos locales para completar la respuesta o usar si falla Drupal. */
  fallback?: PageHeroData;
};

function getText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getFallbackTitle(fallback?: PageHeroData): string | null {
  if (!fallback) return null;
  return typeof fallback.title === "string"
    ? fallback.title
    : fallback.title.map((segment) => segment.text).join("");
}

/**
 * Carga los datos de un hero desde un bundle Drupal JSON:API si la página lo
 * necesita. El componente visual no consulta Drupal y también puede usarse con
 * datos locales o cargados por otros servicios.
 */
export async function getPageHeroFromDrupal({
  contentType,
  imageField,
  titleField = "title",
  filters = {},
  fallback,
}: DrupalPageHeroOptions): Promise<PageHeroData | null> {
  const url = new URL(
    `/jsonapi/node/${encodeURIComponent(contentType)}`,
    getServerBaseUrl(),
  );
  url.searchParams.set("filter[status]", "1");
  url.searchParams.set("include", imageField);
  url.searchParams.set("page[limit]", "1");
  for (const [key, value] of Object.entries(filters)) {
    url.searchParams.set(key, value);
  }

  try {
    const json = await fetchJson<DrupalPageHeroResponse>(url);
    const resource = json.data?.[0];
    if (!resource) return fallback ?? null;

    const title = getText(resource.attributes?.[titleField]) ?? getFallbackTitle(fallback);
    if (!title) return fallback ?? null;

    const imageReference = resource.relationships?.[imageField]?.data;
    const file = json.included?.find(
      (item) => item.type === "file--file" && item.id === imageReference?.id,
    );
    const imageUrl = resolveUrl(
      file?.attributes?.uri?.url,
      getPublicBaseUrl(),
    );

    return {
      title,
      imageUrl: imageUrl ?? fallback?.imageUrl ?? null,
      imageAlt: imageReference?.meta?.alt?.trim() || fallback?.imageAlt || title,
    };
  } catch (error) {
    console.error("No se pudo cargar el hero desde Drupal:", error);
    return fallback ?? null;
  }
}
