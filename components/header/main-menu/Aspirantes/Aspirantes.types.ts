/**
 * Props del componente presentacional `Aspirantes`.
 *
 * Renderiza el enlace de nivel superior "Estudia en la UD" del menú principal.
 */
export interface AspirantesProps {
  /** Destino del enlace. Por defecto `/aspirantes`. */
  href?: string;
  /** Callback invocado al activar el enlace. */
  onClose?: () => void;
  /** Clase adicional para componer el contenedor en layouts mayores. */
  className?: string;
}
