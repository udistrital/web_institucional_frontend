import "server-only";

import type { JsonApiResponse } from "next-drupal";
import { slugFiltro } from "@/lib/filtros";
import { fetchJson, getPublicBaseUrl, getServerBaseUrl, resolveUrl } from "./api";
import { createDrupalClient } from "./drupal-client";

export type Faculty = {
  id: string;
  title: string;
  href: string;
  attributes: {
    title: string;
    field_correo_electronico?: string | null;
    field_direccion?: string | null;
    field_horario?: string | null;
    field_nombre_decano?: string | null;
    field_pagina_web?: { uri?: string | null } | null;
    field_pbx?: { processed?: string | null } | null;
  };
  imageUrl: string | null;
  imageAlt: string;
};

type FacultyResource = {
  id: string;
  attributes: {
    title?: string;
    path?: { alias?: string | null } | null;
    field_correo_electronico?: string | null;
    field_direccion?: string | null;
    field_horario?: string | null;
    field_nombre_decano?: string | null;
    field_pagina_web?: { uri?: string | null } | null;
    field_pbx?: { processed?: string | null } | null;
  };
  relationships?: {
    field_imagen_facultad?: {
      data?: { id?: string; meta?: { alt?: string } } | null;
    };
  };
};

type IncludedFile = {
  type?: string;
  id?: string;
  attributes?: { uri?: { url?: string } };
};

type FacultiesResponse = {
  data?: FacultyResource[];
  included?: IncludedFile[];
};

const drupal = createDrupalClient();
const OPCIONES_CACHE: RequestInit =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { next: { revalidate: 3600 } };

function mapFaculty(
  faculty: FacultyResource,
  included: IncludedFile[],
  imageBaseUrl: string,
): Faculty {
  const imageReference = faculty.relationships?.field_imagen_facultad?.data;
  const imageFile = included.find(
    (item) => item.type === "file--file" && item.id === imageReference?.id,
  );
  const title = faculty.attributes.title?.trim() || "Facultad";

  return {
    id: faculty.id,
    title,
    href: faculty.attributes.path?.alias || `/facultades/${faculty.id}`,
    attributes: {
      title,
      field_correo_electronico: faculty.attributes.field_correo_electronico,
      field_direccion: faculty.attributes.field_direccion,
      field_horario: faculty.attributes.field_horario,
      field_nombre_decano: faculty.attributes.field_nombre_decano,
      field_pagina_web: faculty.attributes.field_pagina_web,
      field_pbx: faculty.attributes.field_pbx,
    },
    imageUrl: resolveUrl(imageFile?.attributes?.uri?.url, imageBaseUrl),
    imageAlt: imageReference?.meta?.alt?.trim() || title,
  };
}

function slugDesdeAlias(alias?: string | null): string {
  const partes = alias?.split("/").filter(Boolean) ?? [];
  return slugFiltro(partes[partes.length - 1] || alias);
}

export async function getFaculties(): Promise<Faculty[]> {
  const apiUrl = new URL("/jsonapi/node/facultades", getServerBaseUrl());
  apiUrl.searchParams.set("filter[status]", "1");
  apiUrl.searchParams.set("include", "field_imagen_facultad");
  apiUrl.searchParams.set("sort", "title");

  try {
    const json = await fetchJson<FacultiesResponse>(apiUrl);
    const included = json.included ?? [];
    const imageBaseUrl = getPublicBaseUrl();

    return (json.data ?? []).map((faculty) =>
      mapFaculty(faculty, included, imageBaseUrl),
    );
  } catch {
    return [];
  }
}

/**
 * Obtiene una facultad publicada por el slug de su ruta.
 * Drupal puede devolver `path.alias` vacío en el entorno local; en ese caso
 * se conserva el título como respaldo para no depender de UUIDs.
 */
export async function getFacultyBySlug(slug: string): Promise<Faculty | null> {
  const targetSlug = slugFiltro(slug);
  if (!targetSlug) return null;

  try {
    const response = await drupal.getResourceCollection<JsonApiResponse>(
      "node--facultades",
      {
        params: {
          "filter[status]": "1",
          include: "field_imagen_facultad",
          sort: "title",
          "page[limit]": "50",
        },
        deserialize: false,
        ...OPCIONES_CACHE,
      },
    );
    const json = response as unknown as FacultiesResponse;
    const resources = json.data ?? [];
    const resource =
      resources.find(
        (item) => slugDesdeAlias(item.attributes.path?.alias) === targetSlug,
      ) ??
      resources.find(
        (item) => slugFiltro(item.attributes.title) === targetSlug,
      );

    return resource
      ? mapFaculty(resource, json.included ?? [], getPublicBaseUrl())
      : null;
  } catch (error) {
    console.error("No se pudo resolver la facultad desde Drupal:", error);
    return null;
  }
}
