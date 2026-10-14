import type { CategoryNode, Tablero } from "@/services/tableros";

export interface TablerosExplorerProps {
  categories: CategoryNode[];
  uncategorized: Tablero[];
  /** Clase adicional aplicada al elemento raíz para composición. */
  className?: string;
}
