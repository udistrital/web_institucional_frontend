export interface TableroIframeProps {
  src: string;
  title: string;
  /** Si el tablero está visible (activo). Se mantiene montado aunque esté oculto. */
  isActive: boolean;
  /** Clase adicional aplicada al elemento raíz para composición. */
  className?: string;
}
