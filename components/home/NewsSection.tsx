import NewsCarousel from "./NewsCarousel";

type DrupalNewsResource = {
  id?: string;
  attributes?: {
    title?: string;
    created?: string;
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

type DrupalNewsResponse = {
  data?: DrupalNewsResource[];
  included?: DrupalIncludedItem[];
};

const fallbackNews = [
  {
    id: "fallback-1",
    title: "Prepárate para la VIII edición de ‘La Noche y las Lunecirnagas’",
    description: "Conoce todos los detalles de esta actividad cultural de la Universidad Distrital.",
    image: "/image/vida universitaria.jpeg",
    alt: "Afiche de una actividad cultural universitaria",
    publishedAt: "2026-10-20T00:00:00Z",
  },
  {
    id: "fallback-2",
    title: "La Universidad Distrital fortalece su compromiso social",
    description: "Consulta las novedades y actividades de nuestra comunidad universitaria.",
    image: "/image/compromiso social.jpeg",
    alt: "Comunidad universitaria participando en una actividad",
    publishedAt: "2026-10-13T00:00:00Z",
  },
  {
    id: "fallback-3",
    title: "La investigación impulsa nuevas soluciones para la sociedad",
    description: "Conoce los proyectos y avances que nacen de la investigación universitaria.",
    image: "/image/investigacion.jpeg",
    alt: "Estudiante consultando material de investigación",
    publishedAt: "2026-10-06T00:00:00Z",
  },
  {
    id: "fallback-4",
    title: "La comunidad universitaria construye nuevas oportunidades",
    description: "Descubre las iniciativas que fortalecen la vida universitaria.",
    image: "/image/vida universitaria.jpeg",
    alt: "Integrantes de la comunidad universitaria",
    publishedAt: "2026-09-29T00:00:00Z",
  },
  {
    id: "fallback-5",
    title: "Nuevas experiencias para aprender y compartir",
    description: "Explora las actividades que enriquecen la experiencia universitaria.",
    image: "/image/compromiso social.jpeg",
    alt: "Comunidad universitaria reunida",
    publishedAt: "2026-09-22T00:00:00Z",
  },
];

function resolveNewsImageUrl(
  resource: DrupalNewsResource,
  included: DrupalIncludedItem[] = [],
): string | null {
  const imageReference = resource.relationships?.field_imagen?.data;
  if (!imageReference?.id) return null;

  const fileItem = included.find(
    (item) => item.type === "file--file" && item.id === imageReference.id,
  );

  const relativeImagePath = fileItem?.attributes?.uri?.url;
  if (!relativeImagePath) return null;

  const publicBaseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL || "http://localhost:8080";

  try {
    return new URL(relativeImagePath, publicBaseUrl).toString();
  } catch {
    return relativeImagePath;
  }
}

async function getNews() {
  const isServerInsideDocker = Boolean(process.env.DRUPAL_BASE_URL && !process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.includes("localhost"));
  
  const serverBaseUrl =
    (isServerInsideDocker ? process.env.DRUPAL_BASE_URL : process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) ||
    process.env.DRUPAL_BASE_URL ||
    "http://localhost:8080";

  const apiUrl = new URL("/jsonapi/node/news", serverBaseUrl);
  apiUrl.searchParams.set("filter[status]", "1");
  apiUrl.searchParams.set("include", "field_imagen");
  apiUrl.searchParams.set("sort", "-created");
  apiUrl.searchParams.set("page[limit]", "8");

  const isDev = process.env.NODE_ENV === "development";

  try {
    const response = await fetch(apiUrl.toString(), {
      // En desarrollo desactiva la caché en disco para ver cambios inmediatamente
      ...(isDev ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
    });

    if (!response.ok) {
      console.error(`[Drupal Error] Status: ${response.status} en la URL: ${apiUrl.toString()}`);
      return fallbackNews;
    }

    const json = (await response.json()) as DrupalNewsResponse;
    const items = (json.data ?? [])
      .map((resource, index) => {
        const title = resource.attributes?.title || "Noticia";
        const description =
          resource.attributes?.field_resumen ||
          "Conoce más sobre esta noticia.";
        const image = resolveNewsImageUrl(resource, json.included ?? []);
        const alt =
          resource.relationships?.field_imagen?.data?.meta?.alt ||
          resource.attributes?.title ||
          "Imagen de la noticia";

        return {
          id: resource.id || `news-${index}`,
          title,
          description,
          image: image || fallbackNews[0].image,
          alt,
          publishedAt: resource.attributes?.created || new Date().toISOString(),
          href: resource.attributes?.path?.alias || "#noticias",
        };
      })
      .filter((item) => item.title && item.description)
      .slice(0, 8);

    return items.length ? items : fallbackNews;
  } catch (error) {
    console.error("[Fetch Error] No se pudo conectar con Drupal:", error);
    return fallbackNews;
  }
}

export type NewsItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  publishedAt: string;
  href?: string;
}

export default async function NewsSection() {
  const news = await getNews();

  return (
    <section className="bg-[#f5f5f5] px-4 py-[clamp(2rem,3.5vw,2.75rem)]" id="noticias" aria-labelledby="news-title">
      <div className="mx-auto max-w-[var(--content-width)]">
        <h2
          className="mb-8 font-[var(--font-montserrat)] text-[length:var(--fs-h2)] font-bold leading-[.9] text-[var(--institutional-red)]"
          id="news-title"
        >
          Noticias
        </h2>
        <NewsCarousel news={news} />
        <a
          className="mx-auto mt-10 block w-fit rounded-[5px] bg-[var(--institutional-red)] px-11 py-3 font-semibold text-white transition-colors hover:bg-[var(--institutional-gold)] hover:text-black focus-visible:outline-none"
          href="#noticias"
        >
          Ver todas las noticias
        </a>
      </div>
    </section>
  );
}