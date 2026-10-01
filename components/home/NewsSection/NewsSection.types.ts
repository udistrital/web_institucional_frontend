/**
 * Props del componente contenedor `NewsSection`.
 *
 * `NewsSection` es un contenedor (server component): obtiene las noticias desde
 * la Capa_Servicios (`getNews`) y delega el render en el presentacional
 * `NewsList`. No conoce la estructura JSON:API.
 */
export interface NewsSectionProps {
  /** Clase adicional para componer la sección en layouts mayores. */
  className?: string;
}
