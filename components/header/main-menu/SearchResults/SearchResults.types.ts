import type { NavigationItem } from "../navigation";

/** Resultado individual de la búsqueda sobre la navegación. */
export type SearchResult = {
  item: NavigationItem;
  parents: string[];
  score: number;
};

/**
 * Props del componente presentacional `SearchResults`.
 *
 * Muestra el panel de resultados de la búsqueda en memoria sobre la
 * navegación. No realiza peticiones de red.
 */
export interface SearchResultsProps {
  /** Resultados a listar. */
  results: SearchResult[];
  /** Callback invocado al seleccionar un resultado. */
  onSelect: () => void;
  /** Clase adicional para componer el panel en layouts mayores. */
  className?: string;
}
