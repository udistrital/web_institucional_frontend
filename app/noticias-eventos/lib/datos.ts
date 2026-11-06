import "server-only";

import type { ContentCardItem, ContentKind } from "@/components/common/content-card";
import { getAllNews } from "@/services/noticias";
import { getAllEvents } from "@/services/eventos";
import { combinarContenido, slugContenido } from "./contenido";

/** Carga todo el contenido (noticias + eventos) ya normalizado y ordenado. */
export async function cargarContenido(): Promise<ContentCardItem[]> {
  const [noticias, eventos] = await Promise.all([getAllNews(), getAllEvents()]);
  return combinarContenido(noticias, eventos);
}

/**
 * Busca un contenido por su tipo y el slug de su título. Si dos contenidos del
 * mismo tipo comparten slug, devuelve el más reciente (la lista viene ordenada
 * de más nuevo a más antiguo).
 */
export async function buscarContenido(
  kind: ContentKind,
  slug: string,
): Promise<ContentCardItem | null> {
  const items = await cargarContenido();
  return (
    items.find(
      (item) => item.kind === kind && slugContenido(item) === slug,
    ) ?? null
  );
}

/**
 * Últimos contenidos publicados, excluyendo el actual. Útil para la columna
 * lateral de la página de detalle.
 */
export async function ultimosContenidos(
  excluirId?: string,
  limite = 6,
): Promise<ContentCardItem[]> {
  const items = await cargarContenido();
  return items.filter((item) => item.id !== excluirId).slice(0, limite);
}
