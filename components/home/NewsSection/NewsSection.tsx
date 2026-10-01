import { NewsList } from "@/components/news-list";
import { getNews } from "@/services/news";
import type { NewsItem } from "@/services/news.types";

import styles from "./news-section.module.css";
import type { NewsSectionProps } from "./NewsSection.types";

/**
 * Contenedor de la sección de noticias (server component).
 *
 * Obtiene las noticias desde la Capa_Servicios (`getNews`), elige la lista de
 * reserva cuando hay error o la lista viene vacía, y delega el render en el
 * presentacional `NewsList` con datos ya planos (`NewsItem[]`). No realiza
 * peticiones de red directas ni conoce la estructura de JSON:API: esa lógica
 * vive por completo en el servicio.
 */

/**
 * Noticias de reserva mostradas cuando el servicio falla o no devuelve
 * resultados. Son datos planos (`NewsItem[]`), no una respuesta JSON:API.
 */
const fallbackNews: NewsItem[] = [
  {
    id: "fallback-1",
    title: "Prepárate para la VIII edición de ‘La Noche y las Lunecirnagas’",
    description:
      "Conoce todos los detalles de esta actividad cultural de la Universidad Distrital.",
    image: "/image/vida universitaria.jpeg",
    alt: "Afiche de una actividad cultural universitaria",
    href: null,
  },
  {
    id: "fallback-2",
    title: "La Universidad Distrital fortalece su compromiso social",
    description:
      "Consulta las novedades y actividades de nuestra comunidad universitaria.",
    image: "/image/compromiso social.jpeg",
    alt: "Comunidad universitaria participando en una actividad",
    href: null,
  },
  {
    id: "fallback-3",
    title: "La investigación impulsa nuevas soluciones para la sociedad",
    description:
      "Conoce los proyectos y avances que nacen de la investigación universitaria.",
    image: "/image/investigacion.jpeg",
    alt: "Estudiante consultando material de investigación",
    href: null,
  },
];

export default async function NewsSection({ className }: NewsSectionProps) {
  const { items, hasError } = await getNews();
  const news = hasError || items.length === 0 ? fallbackNews : items;

  const sectionClassName = className
    ? `${styles["news-section"]} ${className}`
    : styles["news-section"];

  return (
    <section
      className={sectionClassName}
      id="noticias"
      aria-labelledby="news-title"
    >
      <div className={styles["news-content"]}>
        <h2 id="news-title">Noticias</h2>
        <NewsList items={news} />
        <a className={styles["news-more-link"]} href="#noticias">
          Ver todas las noticias
        </a>
      </div>
    </section>
  );
}
