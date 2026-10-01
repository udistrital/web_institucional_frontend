/**
 * Interfaces planas del servicio de noticias.
 *
 * Estas son las únicas formas de datos que la Capa_Servicios expone a los
 * componentes: no contienen ninguna estructura de JSON:API
 * (`data`/`attributes`/`relationships`/`included`).
 */

/** Noticia en forma plana lista para renderizar en la UI. */
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  /** URL absoluta de la imagen ya resuelta. */
  image: string;
  alt: string;
  /** Alias/ruta de la noticia o `null` si no tiene enlace propio. */
  href: string | null;
}

/**
 * Resultado de `getNews()`: lista de noticias planas más una señalización
 * tipada de error, sin exponer la estructura JSON:API ni lanzar excepciones.
 */
export interface NewsResult {
  items: NewsItem[];
  hasError: boolean;
}
