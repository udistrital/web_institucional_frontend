/**
 * Props del componente presentacional `LiveBadge`.
 *
 * Es puramente presentacional: muestra la insignia de estado de emisión y un
 * botón para copiar el enlace de la página. No realiza peticiones de red.
 */
export interface LiveBadgeProps {
  /** Indica si la emisora está reproduciéndose (anima el indicador). */
  isPlaying: boolean;
  /** Texto de la insignia. Por defecto `'EN VIVO'`. */
  label?: string;
  /** Clase adicional para componer el badge en layouts mayores. */
  className?: string;
}
