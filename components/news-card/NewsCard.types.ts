import type { NewsItem } from "@/services/news.types";

/**
 * Props del componente presentacional `NewsCard`.
 *
 * Es puramente presentacional: recibe una noticia ya plana (`NewsItem`) y la
 * renderiza. No realiza peticiones de red ni conoce la estructura JSON:API.
 */
export interface NewsCardProps {
  /** Noticia plana a renderizar. */
  item: NewsItem;
  /** Clase adicional para componer la tarjeta en layouts mayores. */
  className?: string;
}
