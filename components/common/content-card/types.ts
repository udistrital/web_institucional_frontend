export type ContentKind = "noticia" | "evento";

/**
 * Modelo normalizado que alimenta la tarjeta de contenido reutilizable. Tanto
 * las noticias como los eventos se convierten a esta forma antes de llegar a
 * la UI, de modo que la tarjeta no necesita conocer el origen de los datos.
 */
export type ContentCardItem = {
  id: string;
  kind: ContentKind;
  title: string;
  /** Resumen corto que se muestra en la tarjeta. */
  description?: string;
  /** Descripción completa que se muestra al abrir el detalle. */
  detail?: string;
  /** Fuente de la información (facultad, unidad, etc.). */
  source?: string;
  image?: string | null;
  imageAlt?: string;
  /** Fecha principal en ISO 8601: publicación (noticia) o inicio (evento). */
  date: string;
  /** Fecha de fin en ISO 8601, solo para eventos con rango de fechas. */
  endDate?: string;
  /** Enlace al detalle completo del contenido. */
  href?: string;
};
