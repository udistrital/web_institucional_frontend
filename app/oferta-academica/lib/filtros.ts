import { slugFiltro } from "@/lib/filtros";

export { slugFiltro, normalizarBusqueda } from "@/lib/filtros";

export type OpcionFiltro = { valor: string; etiqueta: string };

export function opcionesUnicas(valores: Array<string | null>): OpcionFiltro[] {
  const unicas = new Map<string, string>();
  valores.forEach((valor) => {
    if (valor?.trim()) unicas.set(slugFiltro(valor), valor.trim());
  });
  return [...unicas.entries()]
    .map(([valor, etiqueta]) => ({ valor, etiqueta }))
    .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, "es"));
}
