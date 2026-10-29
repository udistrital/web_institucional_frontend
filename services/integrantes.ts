import "server-only";

import { fetchJson, getPublicBaseUrl, getServerBaseUrl, resolveUrl } from "./api";

export type Integrante = {
  id: string;
  nombre: string;
  puesto: string | null;
  descripcion: string | null;
  imageUrl: string | null;
  imageAlt: string;
};

type IntegranteResource = {
  id: string;
  attributes?: {
    title?: string;
    field_puesto?: string | null;
    field_descripcion_integrante?: string | null;
  };
  relationships?: {
    field_foto?: {
      data?: { id?: string; meta?: { alt?: string } } | null;
    } | null;
  };
};

type IncludedFile = {
  type?: string;
  id?: string;
  attributes?: { uri?: { url?: string } };
};

type IntegrantesResponse = {
  data?: IntegranteResource[];
  included?: IncludedFile[];
};

export async function getIntegrantes(): Promise<Integrante[]> {
  const apiUrl = new URL("/jsonapi/node/integrantes", getServerBaseUrl());
  apiUrl.searchParams.set("filter[status]", "1");
  apiUrl.searchParams.set("include", "field_foto");
  apiUrl.searchParams.set("sort", "title");

  try {
    const json = await fetchJson<IntegrantesResponse>(apiUrl);
    const included = json.included ?? [];
    const imageBaseUrl = getPublicBaseUrl();

    return (json.data ?? []).map((integrante) => {
      const imageReference = integrante.relationships?.field_foto?.data;
      const imageFile = included.find(
        (item) => item.type === "file--file" && item.id === imageReference?.id,
      );
      const nombre = integrante.attributes?.title || "Integrante";

      return {
        id: integrante.id,
        nombre,
        puesto: integrante.attributes?.field_puesto ?? null,
        descripcion: integrante.attributes?.field_descripcion_integrante ?? null,
        imageUrl: resolveUrl(imageFile?.attributes?.uri?.url, imageBaseUrl),
        imageAlt: imageReference?.meta?.alt || `Foto de ${nombre}`,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Obtiene al Rector de la Universidad a partir del servicio de integrantes.
 *
 * La foto y la descripción del rector se administran desde Drupal (contenido
 * "integrantes"), por lo que reutilizamos ese endpoint en lugar de crear uno
 * nuevo. Se identifica al rector por su campo `puesto`, excluyendo cargos que
 * contienen "rector" como parte de otra palabra (p. ej. "Vicerrector").
 */
export async function getRector(): Promise<Integrante | null> {
  const integrantes = await getIntegrantes();

  const esRector = (puesto: string | null) => {
    if (!puesto) return false;
    const normalizado = puesto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    // "rector" / "rectora" / "rectoria" pero NO "vicerrector(a)".
    return /\brector/.test(normalizado) && !/vicerrector/.test(normalizado);
  };

  return integrantes.find((integrante) => esRector(integrante.puesto)) ?? null;
}
