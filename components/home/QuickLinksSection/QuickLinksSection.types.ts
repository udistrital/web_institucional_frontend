/**
 * Props del componente presentacional `QuickLinksSection`.
 *
 * Componente cliente que presenta un carrusel de accesos por audiencia con
 * interacción local (swipe/flechas). No realiza peticiones de red ni conoce la
 * estructura JSON:API.
 */
export interface QuickLinksSectionProps {
  /** Clase adicional para componer la sección en layouts mayores. */
  className?: string;
}
