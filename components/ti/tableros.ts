import "server-only";

/**
 * Capa de datos para los "tableros" (dashboards) y su taxonomía de categorías.
 *
 * Sigue el mismo patrón de obtención de datos de Drupal que NewsSection /
 * heroData: resolución de URL base según entorno (dev / docker), caché
 * condicional y valores de reserva ante fallos de conexión.
 */

export type TableroPlatform = string;

export type Tablero = {
  id: string;
  title: string;
  /** URL del tablero para incrustar en un iframe. */
  embedUrl: string | null;
  linkTitle: string | null;
  platform: TableroPlatform | null;
  /** Peso de ordenamiento definido en Drupal (field_peso_orden). */
  order: number;
  /** tid (drupal_internal__tid) de la categoría asociada, si existe. */
  categoryTid: number | null;
};

export type CategoryNode = {
  tid: number;
  id: string;
  name: string;
  weight: number;
  /** tid del padre, o null si es una categoría raíz. */
  parentTid: number | null;
  /** Ruta jerárquica completa desde la raíz hasta esta categoría. */
  path: string[];
  /** Subcategorías directas, ordenadas por weight. */
  children: CategoryNode[];
  /** Tableros que pertenecen directamente a esta categoría. */
  tableros: Tablero[];
};

// ---------------------------------------------------------------------------
// Tipos JSON:API (parciales, solo lo que consumimos)
// ---------------------------------------------------------------------------

type DrupalRelationshipRef = {
  id?: string;
  meta?: {
    drupal_internal__target_id?: number | string;
  };
} | null;

type DrupalTableroResource = {
  id?: string;
  attributes?: {
    title?: string;
    field_enlace?: {
      uri?: string | null;
      resolvable_uri?: string | null;
      title?: string | null;
    } | null;
    field_peso_orden?: number | null;
    field_plataforma?: string | null;
  };
  relationships?: {
    field_categoria?: {
      data?: DrupalRelationshipRef;
    } | null;
  };
};

type DrupalTableroResponse = {
  data?: DrupalTableroResource[];
};

type DrupalTermParentRef = {
  id?: string;
  meta?: {
    drupal_internal__target_id?: number | string;
  };
};

type DrupalTermResource = {
  id?: string;
  attributes?: {
    drupal_internal__tid?: number;
    name?: string;
    weight?: number;
  };
  relationships?: {
    parent?: {
      data?: DrupalTermParentRef[];
    } | null;
  };
};

type DrupalTermResponse = {
  data?: DrupalTermResource[];
};

// ---------------------------------------------------------------------------
// Resolución de URL base (igual que NewsSection / heroData)
// ---------------------------------------------------------------------------

function resolveServerBaseUrl(): string {
  const isServerInsideDocker = Boolean(
    process.env.DRUPAL_BASE_URL &&
      !process.env.NEXT_PUBLIC_DRUPAL_BASE_URL?.includes("localhost"),
  );

  return (
    (isServerInsideDocker
      ? process.env.DRUPAL_BASE_URL
      : process.env.NEXT_PUBLIC_DRUPAL_BASE_URL) ||
    process.env.DRUPAL_BASE_URL ||
    "http://localhost:8080"
  );
}

function getFetchOptions(): RequestInit {
  const isDev = process.env.NODE_ENV === "development";
  return isDev ? { cache: "no-store" } : { next: { revalidate: 3600 } };
}

function toNumber(value: number | string | undefined | null): number | null {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

// Los tableros de Superset requieren "?standalone=1" para incrustarse sin la
// interfaz de navegación. Se añade el parámetro respetando query strings ya
// existentes (y evita duplicarlo).
function withStandaloneParam(url: string): string {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("standalone")) {
      parsed.searchParams.set("standalone", "1");
    }
    return parsed.toString();
  } catch {
    // URL relativa o no parseable: se añade de forma manual y segura.
    if (/([?&])standalone=/.test(url)) return url;
    const separator = url.includes("?") ? (url.endsWith("?") || url.endsWith("&") ? "" : "&") : "?";
    return `${url}${separator}standalone=1`;
  }
}

function isSupersetPlatform(platform: string | null): boolean {
  return platform?.toLowerCase() === "superset";
}

// ---------------------------------------------------------------------------
// Mapeo de recursos
// ---------------------------------------------------------------------------

function mapTablero(resource: DrupalTableroResource): Tablero {
  const link = resource.attributes?.field_enlace;
  const categoryRef = resource.relationships?.field_categoria?.data;

  const platform = resource.attributes?.field_plataforma?.trim() || null;
  const baseUrl = link?.resolvable_uri || link?.uri || null;
  // Solo los tableros de Superset llevan "?standalone=1" antes de incrustarse.
  const embedUrl = baseUrl && isSupersetPlatform(platform)
    ? withStandaloneParam(baseUrl)
    : baseUrl;

  return {
    id: resource.id || "",
    title: resource.attributes?.title?.trim() || "Tablero",
    embedUrl,
    linkTitle: link?.title?.trim() || null,
    platform,
    order: resource.attributes?.field_peso_orden ?? 0,
    categoryTid: toNumber(categoryRef?.meta?.drupal_internal__target_id),
  };
}

function mapTerm(resource: DrupalTermResource): Omit<CategoryNode, "path" | "children" | "tableros"> {
  const parents = resource.relationships?.parent?.data ?? [];
  // En JSON:API una categoría raíz tiene el padre "virtual" (sin tid real).
  const parentTid = parents
    .map((p) => (p.id === "virtual" ? null : toNumber(p.meta?.drupal_internal__target_id)))
    .find((tid): tid is number => tid !== null) ?? null;

  return {
    tid: resource.attributes?.drupal_internal__tid ?? 0,
    id: resource.id || "",
    name: resource.attributes?.name?.trim() || "Sin categoría",
    weight: resource.attributes?.weight ?? 0,
    parentTid,
  };
}

// ---------------------------------------------------------------------------
// Construcción del árbol jerárquico
// ---------------------------------------------------------------------------

function buildCategoryTree(
  terms: Omit<CategoryNode, "path" | "children" | "tableros">[],
  tableros: Tablero[],
): CategoryNode[] {
  const byTid = new Map<number, CategoryNode>();

  for (const term of terms) {
    byTid.set(term.tid, {
      ...term,
      path: [],
      children: [],
      tableros: [],
    });
  }

  // Asociar tableros a su categoría directa.
  for (const tablero of tableros) {
    if (tablero.categoryTid !== null) {
      byTid.get(tablero.categoryTid)?.tableros.push(tablero);
    }
  }

  // Ordenar tableros dentro de cada categoría por order y luego título.
  for (const node of byTid.values()) {
    node.tableros.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "es"));
  }

  const roots: CategoryNode[] = [];

  // Enlazar hijos con padres y calcular la ruta jerárquica.
  for (const node of byTid.values()) {
    if (node.parentTid !== null && byTid.has(node.parentTid)) {
      byTid.get(node.parentTid)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const assignPaths = (node: CategoryNode, ancestors: string[]) => {
    node.path = [...ancestors, node.name];
    node.children.sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name, "es"));
    for (const child of node.children) assignPaths(child, node.path);
  };

  roots.sort((a, b) => a.weight - b.weight || a.name.localeCompare(b.name, "es"));
  for (const root of roots) assignPaths(root, []);

  return roots;
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

export type TablerosData = {
  /** Árbol de categorías con sus tableros. */
  categories: CategoryNode[];
  /** Tableros sin categoría asignada. */
  uncategorized: Tablero[];
  /** true si no se pudo conectar con Drupal. */
  hasError: boolean;
};

async function fetchTableros(baseUrl: string): Promise<Tablero[]> {
  const url = new URL("/jsonapi/node/tablero", baseUrl);
  url.searchParams.set("filter[status]", "1");
  url.searchParams.set("include", "field_categoria");
  url.searchParams.set("sort", "field_peso_orden,title");

  const response = await fetch(url.toString(), getFetchOptions());
  if (!response.ok) {
    throw new Error(`Drupal respondió con HTTP ${response.status} (tableros)`);
  }
  const json = (await response.json()) as DrupalTableroResponse;
  return (json.data ?? []).map(mapTablero).filter((t) => t.id && t.embedUrl);
}

async function fetchCategories(baseUrl: string) {
  const url = new URL("/jsonapi/taxonomy_term/categorias_de_tableros", baseUrl);
  url.searchParams.set("filter[status]", "1");
  url.searchParams.set("include", "parent");
  url.searchParams.set("sort", "weight,name");

  const response = await fetch(url.toString(), getFetchOptions());
  if (!response.ok) {
    throw new Error(`Drupal respondió con HTTP ${response.status} (categorías)`);
  }
  const json = (await response.json()) as DrupalTermResponse;
  return (json.data ?? []).map(mapTerm).filter((t) => t.tid);
}

export async function getTablerosData(): Promise<TablerosData> {
  const baseUrl = resolveServerBaseUrl();

  try {
    const [tableros, terms] = await Promise.all([
      fetchTableros(baseUrl),
      fetchCategories(baseUrl),
    ]);

    const categories = buildCategoryTree(terms, tableros);

    const knownTids = new Set(terms.map((t) => t.tid));
    const uncategorized = tableros.filter(
      (t) => t.categoryTid === null || !knownTids.has(t.categoryTid),
    );

    return { categories, uncategorized, hasError: false };
  } catch (error) {
    console.error("[Tableros] No se pudo conectar con Drupal:", error);
    return { categories: [], uncategorized: [], hasError: true };
  }
}
