/**
 * Props del componente presentacional `FacultyShowcaseSection`.
 *
 * Componente cliente que presenta un carrusel de facultades con interacción
 * local (swipe/flechas). No realiza peticiones de red ni conoce la estructura
 * JSON:API.
 */
export interface FacultyShowcaseSectionProps {
  /** Clase adicional para componer la sección en layouts mayores. */
  className?: string;
}
