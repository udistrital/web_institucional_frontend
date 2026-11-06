import "server-only";

import {
  absolutizarHtml,
  fetchJson,
  getPublicBaseUrl,
  getServerBaseUrl,
  resolveUrl,
} from "./api";
import type { EventItem } from "@/types/domain";

export type { EventItem };

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
    field_fecha_inicio?: string | null;
    field_fecha_fin?: string | null;
    field_descripcion_con_formato?: FormattedText;
    field_fuente_de_informacion?: string | null;
    path?: { alias?: string | null } | null;
  };
  relationships?: {
    field_imagen?: { data?: { id?: string; meta?: { alt?: string } } | null } | null;
  };
};

type Response = {
  data?: Resource[];
  included?: { type?: string; id?: string; attributes?: { uri?: { url?: string } } }[];
};

const fallbackEvents: EventItem[] = [
  {
    id: "fallback-evento-1",
    title: "Feria de Internacionalización con instituciones de Rusia",
    detail: "",
    source: "",
    image: null,
    alt: "",
    startDate: "2026-11-03T00:00:00Z",
    endDate: "2026-11-06T00:00:00Z",
  },
  {
    id: "fallback-evento-2",
    title:
      "Especialízate en Infancia, Cultura y Desarrollo: inscripciones abiertas",
    detail: "",
    source: "",
    image: null,
    alt: "",
    startDate: "2026-10-26T00:00:00Z",
    endDate: "2027-01-08T00:00:00Z",
  },
];

function mapEvents(json: Response): EventItem[] {
  const included = json.included ?? [];
  return (json.data ?? [])
    .map((resource, index) => {
      const startDate = resource.attributes?.field_fecha_inicio;
      const endDate = resource.attributes?.field_fecha_fin;
      const imageRef = resource.relationships?.field_imagen?.data;
      const file = included.find(
        (item) => item.type === "file--file" && item.id === imageRef?.id,
      );
      const image = resolveUrl(file?.attributes?.uri?.url, getPublicBaseUrl());

      return {
        id: resource.id || `evento-${index}`,
        title: resource.attributes?.title || "Evento",
        detail: absolutizarHtml(
          resource.attributes?.field_descripcion_con_formato?.processed?.trim() ||
            "",
        ),
        source: resource.attributes?.field_fuente_de_informacion?.trim() || "",
        image,
        alt:
          imageRef?.meta?.alt ||
          resource.attributes?.title ||
          "Imagen del evento",
        startDate: startDate || "",
        endDate: endDate || startDate || "",
        href: resource.attributes?.path?.alias || "#eventos",
      };
    })
    .filter((item) => item.title && item.startDate);
}

function buildEventsUrl(limit: number): URL {
  const url = new URL("/jsonapi/node/evento", getServerBaseUrl());
  url.searchParams.set("filter[status]", "1");
  url.searchParams.set("include", "field_imagen");
  url.searchParams.set("sort", "field_fecha_inicio");
  url.searchParams.set("page[limit]", String(limit));
  return url;
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    const json = await fetchJson<Response>(buildEventsUrl(8));
    // Si el backend respondió correctamente pero no hay eventos, devolvemos la
    // lista vacía para que la UI muestre el mensaje de "no hay eventos".
    return mapEvents(json).slice(0, 8);
  } catch (error) {
    console.error("[Eventos] No se pudieron cargar los eventos:", error);
    return fallbackEvents;
  }
}

/**
 * Catálogo completo de eventos publicados, usado por la página
 * "Noticias y eventos". A diferencia de {@link getEvents}, no limita el número
 * de resultados para que los filtros puedan operar sobre toda la colección.
 */
export async function getAllEvents(): Promise<EventItem[]> {
  try {
    const json = await fetchJson<Response>(buildEventsUrl(100));
    return mapEvents(json);
  } catch (error) {
    console.error("[Eventos] No se pudo cargar el catálogo de eventos:", error);
    return fallbackEvents;
  }
}
