import type { ContentCardItem } from "@/components/common/content-card";
import type { EventItem, NewsItem } from "@/types/domain";
import { slugFiltro } from "@/lib/filtros";

/**
 * Genera el slug de un contenido a partir de su título. Se usa como segmento
 * de URL legible en la página de detalle.
 */
export function slugContenido(item: Pick<ContentCardItem, "title">): string {
  return slugFiltro(item.title);
}

/** Ruta interna a la página de detalle de un contenido. */
export function rutaContenido(item: Pick<ContentCardItem, "kind" | "title">): string {
  return `/noticias-eventos/${item.kind}/${slugContenido(item)}`;
}

/** Convierte una noticia del dominio en el modelo de la tarjeta de contenido. */
export function noticiaAContenido(noticia: NewsItem): ContentCardItem {
  return {
    id: noticia.id,
    kind: "noticia",
    title: noticia.title,
    description: noticia.description,
    detail: noticia.detail,
    source: noticia.source,
    image: noticia.image,
    imageAlt: noticia.alt,
    date: noticia.publishedAt,
    href: noticia.href,
  };
}

/** Convierte un evento del dominio en el modelo de la tarjeta de contenido. */
export function eventoAContenido(evento: EventItem): ContentCardItem {
  return {
    id: evento.id,
    kind: "evento",
    title: evento.title,
    detail: evento.detail,
    source: evento.source,
    image: evento.image,
    imageAlt: evento.alt,
    date: evento.startDate,
    endDate: evento.endDate,
    href: evento.href,
  };
}

/**
 * Une noticias y eventos en una única lista ordenada de más reciente a más
 * antiguo según su fecha principal (publicación o inicio).
 */
export function combinarContenido(
  noticias: NewsItem[],
  eventos: EventItem[],
): ContentCardItem[] {
  return [
    ...noticias.map(noticiaAContenido),
    ...eventos.map(eventoAContenido),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const NOMBRES_MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

/**
 * Devuelve el rango [inicio, fin] del contenido. Las noticias tienen una sola
 * fecha; los eventos pueden abarcar un periodo. Si alguna fecha es inválida se
 * ignora el rango.
 */
function rangoFechas(item: ContentCardItem): { inicio: Date; fin: Date } | null {
  const inicio = new Date(item.date);
  if (Number.isNaN(inicio.getTime())) return null;
  const fin = item.endDate ? new Date(item.endDate) : inicio;
  return { inicio, fin: Number.isNaN(fin.getTime()) ? inicio : fin };
}

/** Indica si el rango del contenido abarca el año indicado. */
export function itemCubreAnio(item: ContentCardItem, anio: string): boolean {
  const rango = rangoFechas(item);
  if (!rango) return false;
  const objetivo = Number(anio);
  return rango.inicio.getFullYear() <= objetivo && objetivo <= rango.fin.getFullYear();
}

/**
 * Indica si el rango del contenido abarca el mes indicado ("1".."12"),
 * recorriendo todos los meses entre el inicio y el fin del periodo.
 */
export function itemCubreMes(item: ContentCardItem, mes: string): boolean {
  const rango = rangoFechas(item);
  if (!rango) return false;
  const objetivo = Number(mes) - 1;
  const inicioAbs = rango.inicio.getFullYear() * 12 + rango.inicio.getMonth();
  const finAbs = rango.fin.getFullYear() * 12 + rango.fin.getMonth();
  for (let actual = inicioAbs; actual <= finAbs; actual += 1) {
    if (actual % 12 === objetivo) return true;
  }
  return false;
}

/**
 * Lista descendente de años presentes en el contenido, considerando el rango
 * completo de cada evento (un evento 2026→2027 aparece en ambos años).
 */
export function aniosDisponibles(items: ContentCardItem[]): string[] {
  const anios = new Set<number>();
  items.forEach((item) => {
    const rango = rangoFechas(item);
    if (!rango) return;
    for (let anio = rango.inicio.getFullYear(); anio <= rango.fin.getFullYear(); anio += 1) {
      anios.add(anio);
    }
  });
  return [...anios].sort((a, b) => b - a).map(String);
}

export type OpcionMes = { valor: string; etiqueta: string };

/**
 * Meses presentes en el contenido, en orden cronológico, considerando el rango
 * completo de cada evento. El valor es el número de mes ("1".."12").
 */
export function mesesDisponibles(items: ContentCardItem[]): OpcionMes[] {
  const meses = new Set<number>();
  items.forEach((item) => {
    const rango = rangoFechas(item);
    if (!rango) return;
    const inicioAbs = rango.inicio.getFullYear() * 12 + rango.inicio.getMonth();
    const finAbs = rango.fin.getFullYear() * 12 + rango.fin.getMonth();
    for (let actual = inicioAbs; actual <= finAbs; actual += 1) {
      meses.add(actual % 12);
    }
  });
  return [...meses]
    .sort((a, b) => a - b)
    .map((indice) => ({
      valor: String(indice + 1),
      etiqueta: NOMBRES_MESES[indice],
    }));
}

/** Fuentes de información presentes en el contenido, ordenadas alfabéticamente. */
export function fuentesDisponibles(items: ContentCardItem[]): string[] {
  const fuentes = new Set<string>();
  items.forEach((item) => {
    const fuente = item.source?.trim();
    if (fuente) fuentes.add(fuente);
  });
  return [...fuentes].sort((a, b) => a.localeCompare(b, "es"));
}
