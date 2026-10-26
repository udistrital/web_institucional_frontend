import "server-only";

import { fetchJson, getPublicBaseUrl, getServerBaseUrl, resolveUrl } from "./api";

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  publishedAt: string;
  href?: string;
};

type Resource = {
  id?: string;
  attributes?: {
    title?: string;
    created?: string;
    field_resumen?: string | null;
    path?: { alias?: string | null } | null;
  };
  relationships?: {
    field_imagen?: { data?: { id?: string; meta?: { alt?: string } } | null } | null;
  };
};

type Response = { data?: Resource[]; included?: { type?: string; id?: string; attributes?: { uri?: { url?: string } } }[] };

const fallbackNews: NewsItem[] = [
  { id: "fallback-1", title: "Prepárate para la VIII edición de ‘La Noche y las Lunecirnagas’", description: "Conoce todos los detalles de esta actividad cultural de la Universidad Distrital.", image: "/image/vida universitaria.jpeg", alt: "Afiche de una actividad cultural universitaria", publishedAt: "2026-10-20T00:00:00Z" },
  { id: "fallback-2", title: "La Universidad Distrital fortalece su compromiso social", description: "Consulta las novedades y actividades de nuestra comunidad universitaria.", image: "/image/compromiso social.jpeg", alt: "Comunidad universitaria participando en una actividad", publishedAt: "2026-10-13T00:00:00Z" },
  { id: "fallback-3", title: "La investigación impulsa nuevas soluciones para la sociedad", description: "Conoce los proyectos y avances que nacen de la investigación universitaria.", image: "/image/investigacion.jpeg", alt: "Estudiante consultando material de investigación", publishedAt: "2026-10-06T00:00:00Z" },
  { id: "fallback-4", title: "La comunidad universitaria construye nuevas oportunidades", description: "Descubre las iniciativas que fortalecen la vida universitaria.", image: "/image/vida universitaria.jpeg", alt: "Integrantes de la comunidad universitaria", publishedAt: "2026-09-29T00:00:00Z" },
  { id: "fallback-5", title: "Nuevas experiencias para aprender y compartir", description: "Explora las actividades que enriquecen la experiencia universitaria.", image: "/image/compromiso social.jpeg", alt: "Comunidad universitaria reunida", publishedAt: "2026-09-22T00:00:00Z" },
];

export async function getNews(): Promise<NewsItem[]> {
  const url = new URL("/jsonapi/node/news", getServerBaseUrl());
  url.searchParams.set("filter[status]", "1");
  url.searchParams.set("include", "field_imagen");
  url.searchParams.set("sort", "-created");
  url.searchParams.set("page[limit]", "8");

  try {
    const json = await fetchJson<Response>(url);
    const included = json.included ?? [];
    const items = (json.data ?? []).map((resource, index) => {
      const imageRef = resource.relationships?.field_imagen?.data;
      const file = included.find((item) => item.type === "file--file" && item.id === imageRef?.id);
      const image = resolveUrl(file?.attributes?.uri?.url, getPublicBaseUrl());
      return {
        id: resource.id || `news-${index}`,
        title: resource.attributes?.title || "Noticia",
        description: resource.attributes?.field_resumen || "Conoce más sobre esta noticia.",
        image: image || fallbackNews[0].image,
        alt: imageRef?.meta?.alt || resource.attributes?.title || "Imagen de la noticia",
        publishedAt: resource.attributes?.created || new Date().toISOString(),
        href: resource.attributes?.path?.alias || "#noticias",
      };
    }).filter((item) => item.title && item.description);
    return items.length ? items.slice(0, 8) : fallbackNews;
  } catch (error) {
    console.error("[Noticias] No se pudieron cargar las noticias:", error);
    return fallbackNews;
  }
}
