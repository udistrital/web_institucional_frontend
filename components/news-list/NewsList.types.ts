import type { NewsItem } from "@/services/news.types";

/**
 * Props del componente presentacional `NewsList`.
 *
 * Es puramente presentacional: recibe una lista de noticias ya planas
 * (`NewsItem[]`) y las renderiza mapeando cada una a una `NewsCard`. No realiza
 * peticiones de red ni conoce la estructura JSON:API.
 */
export interface NewsListProps {
  /** Noticias planas a renderizar. */
  items: NewsItem[];
  /** Clase adicional para componer la grilla en layouts mayores. */
  className?: string;
}
