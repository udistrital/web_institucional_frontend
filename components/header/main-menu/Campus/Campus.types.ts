/**
 * Props del componente presentacional `Campus`.
 *
 * Renderiza el menú desplegable de ancho completo "Campus".
 */
export interface CampusProps {
  /** Indica si el menú está abierto. */
  isOpen: boolean;
  /** Alterna la apertura del menú. */
  onToggle: () => void;
  /** Cierra el menú. */
  onClose: () => void;
  /** Handler opcional al entrar el puntero. */
  onMouseEnter?: () => void;
  /** Handler opcional al salir el puntero. */
  onMouseLeave?: () => void;
  /** Clase adicional para componer el contenedor en layouts mayores. */
  className?: string;
}
