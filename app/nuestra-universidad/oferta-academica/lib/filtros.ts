export type OpcionFiltro = { valor: string; etiqueta: string };

export function slugFiltro(texto: string | null | undefined): string {
  return (texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizarBusqueda(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

export function opcionesUnicas(valores: Array<string | null>): OpcionFiltro[] {
  const unicas = new Map<string, string>();
  valores.forEach((valor) => {
    if (valor?.trim()) unicas.set(slugFiltro(valor), valor.trim());
  });
  return [...unicas.entries()]
    .map(([valor, etiqueta]) => ({ valor, etiqueta }))
    .sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, "es"));
}
