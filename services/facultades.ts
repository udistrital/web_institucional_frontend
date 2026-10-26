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

import { fetchJson, getPublicBaseUrl, getServerBaseUrl, resolveUrl } from "./api";

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

export async function getFaculties(): Promise<Faculty[]> {
  const apiUrl = new URL("/jsonapi/node/facultades", getServerBaseUrl());
  apiUrl.searchParams.set("filter[status]", "1");
  apiUrl.searchParams.set("include", "field_imagen_facultad");
  apiUrl.searchParams.set("sort", "title");

  try {
    const json = await fetchJson<FacultiesResponse>(apiUrl);
    const included = json.included ?? [];
    const imageBaseUrl = getPublicBaseUrl();

    return (json.data ?? []).map((faculty) => {
      const imageReference = faculty.relationships?.field_imagen_facultad?.data;
      const imageFile = included.find(
        (item) => item.type === "file--file" && item.id === imageReference?.id,
      );
      const title = faculty.attributes.title || "Facultad";

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
        imageAlt: imageReference?.meta?.alt || title,
      };
    });
  } catch {
    return [];
  }
}