/**
 * Props del componente presentacional `NuestraUniversidad`.
 *
 * Renderiza el menú desplegable compacto "Nuestra universidad".
 */
export interface NuestraUniversidadProps {
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
