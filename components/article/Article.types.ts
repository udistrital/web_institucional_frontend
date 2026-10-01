import type { Articulo } from "@/services/articles.types";

/** Props del componente presentacional `Article`. */
export interface ArticleProps {
  /** Datos planos del artículo listos para renderizar. */
  articulo: Articulo;
  /** Clases CSS adicionales para componer en layouts mayores. */
  className?: string;
}
