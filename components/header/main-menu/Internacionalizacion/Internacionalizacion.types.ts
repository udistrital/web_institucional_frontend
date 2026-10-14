/**
 * Props del componente presentacional `Internacionalizacion`.
 *
 * Renderiza el enlace de nivel superior "Internacionalización" del menú
 * principal.
 */
export interface InternacionalizacionProps {
  /** Destino del enlace. Por defecto `/internacionalizacion`. */
  href?: string;
  /** Callback invocado al activar el enlace. */
  onClose?: () => void;
  /** Clase adicional para componer el contenedor en layouts mayores. */
  className?: string;
}
