import "server-only";

import {
  getFetchOptions,
  resolvePublicAssetUrl,
  resolveServerBaseUrl,
} from "@/services/drupal-client";

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
  mobileImage: string;
  mobileWidth: number | null;
  mobileHeight: number | null;
  alt: string;
  linkUrl: string | null;
  linkTitle: string | null;
};

type DrupalFileReference = {
  id?: string;
  meta?: {
    alt?: string;
    title?: string;
    width?: number;
    height?: number;
  };
} | null;

type DrupalBannerResource = {
  id?: string;
  attributes?: {
    title?: string;
    field_descripcion_corta?: string | null;
    field_enlace?: {
      uri?: string | null;
      resolvable_uri?: string | null;
      title?: string | null;
    } | null;
  };
  relationships?: {
    field_banner_principal?: {
      data?: DrupalFileReference;
    } | null;
    field_banner_movil?: {
      data?: DrupalFileReference;
    } | null;
  };
};

type DrupalIncludedItem = {
  type?: string;
  id?: string;
  attributes?: {
    uri?: {
      url?: string;
    };
  };
};

type DrupalBannerResponse = {
  data?: DrupalBannerResource[];
  included?: DrupalIncludedItem[];
};

export const fallbackHeroSlides: HeroSlide[] = [
  {
    id: "fallback-hero-1",
    title: "Universidad Distrital le da la bienvenida a los nuevos estudiantes y sus familias",
    description:
      "Bienestar Universitario anunció la fecha establecida para la realización del evento de bienvenida.",
    image: "/image/hero.jpeg",
    mobileImage: "/image/hero.jpeg",
    mobileWidth: 400,
    mobileHeight: 400,
    alt: "Estudiante de la Universidad Distrital usando casco de seguridad",
    linkUrl: "#audiencias",
    linkTitle: "Explorar accesos por rol",
  },
  {
    id: "fallback-hero-2",
    title: "Construimos universidad con compromiso social",
    description:
      "Conoce las noticias y actividades que conectan a nuestra comunidad universitaria.",
    image: "/image/compromiso social.jpeg",
    mobileImage: "/image/compromiso social.jpeg",
    mobileWidth: 400,
    mobileHeight: 400,
    alt: "Comunidad universitaria reunida en una actividad institucional",
    linkUrl: "#audiencias",
    linkTitle: "Explorar accesos por rol",
  },
];

function resolveFileUrl(
  fileReference: DrupalFileReference | undefined,
  included: DrupalIncludedItem[],
): string | null {
  if (!fileReference?.id) return null;

  const fileItem = included.find(
    (item) => item.type === "file--file" && item.id === fileReference.id,
  );

  const relativeImagePath = fileItem?.attributes?.uri?.url;
  if (!relativeImagePath) return null;

  return resolvePublicAssetUrl(relativeImagePath);
}

function mapResourceToSlide(
  resource: DrupalBannerResource,
  included: DrupalIncludedItem[],
  index: number,
): HeroSlide {
  const principalReference = resource.relationships?.field_banner_principal?.data;
  const mobileReference = resource.relationships?.field_banner_movil?.data;

  const desktopImage = resolveFileUrl(principalReference, included);
  const mobileImage = resolveFileUrl(mobileReference, included);

  const fallback = fallbackHeroSlides[index % fallbackHeroSlides.length];

  const image = desktopImage || mobileImage || fallback.image;

  const link = resource.attributes?.field_enlace;

  return {
    id: resource.id || `hero-${index}`,
    title: resource.attributes?.title?.trim() || fallback.title,
    description:
      resource.attributes?.field_descripcion_corta?.trim() || fallback.description,
    image,
    mobileImage: mobileImage || image,
    mobileWidth: mobileReference?.meta?.width ?? fallback.mobileWidth,
    mobileHeight: mobileReference?.meta?.height ?? fallback.mobileHeight,
    alt:
      principalReference?.meta?.alt ||
      mobileReference?.meta?.alt ||
      resource.attributes?.title ||
      "Imagen destacada de la Universidad Distrital",
    linkUrl: link?.resolvable_uri || link?.uri || null,
    linkTitle: link?.title?.trim() || null,
  };
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const serverBaseUrl = resolveServerBaseUrl();

  const apiUrl = new URL("/jsonapi/node/banner_hero", serverBaseUrl);
  apiUrl.searchParams.set("filter[status]", "1");
  apiUrl.searchParams.set("include", "field_banner_principal,field_banner_movil");
  apiUrl.searchParams.set("sort", "-created");

  try {
    const response = await fetch(apiUrl.toString(), getFetchOptions());

    if (!response.ok) {
      console.error(
        `[Drupal Error] Status: ${response.status} en la URL: ${apiUrl.toString()}`,
      );
      return fallbackHeroSlides;
    }

    const json = (await response.json()) as DrupalBannerResponse;
    const included = json.included ?? [];

    const slides = (json.data ?? [])
      .map((resource, index) => mapResourceToSlide(resource, included, index))
      .filter((slide) => slide.title && slide.image);

    return slides.length ? slides : fallbackHeroSlides;
  } catch (error) {
    console.error("[Fetch Error] No se pudo conectar con Drupal:", error);
    return fallbackHeroSlides;
  }
}
