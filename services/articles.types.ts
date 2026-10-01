/**
 * Interfaces planas del servicio de artículos.
 *
 * Estas son las únicas formas de datos que la Capa_Servicios expone a los
 * componentes: no contienen ninguna estructura de JSON:API
 * (`data`/`attributes`/`relationships`/`included`).
 */

/** Artículo en forma plana listo para renderizar en la UI. */
export interface Articulo {
  id: string;
  title: string;
  /** HTML ya procesado del cuerpo (`body.processed`) o `null` si no hay. */
  bodyHtml: string | null;
  /** Fecha de creación en formato ISO. */
  createdAt: string;
  /** URL absoluta del póster ya resuelta o `null` si no tiene imagen. */
  posterUrl: string | null;
  posterAlt: string;
}

/**
 * Resultado de `getArticleBySlug()`: unión discriminada que señala de forma
 * tipada si el artículo se encontró, no existe o hubo un error, sin exponer
 * nunca la estructura JSON:API ni lanzar excepciones.
 */
export type ArticuloResult =
  | { status: "ok"; articulo: Articulo }
  | { status: "not-found" }
  | { status: "error" };

/** Parámetro de ruta para la ruta dinámica `[...slug]`. */
export interface ArticuloParam {
  slug: string[];
}
