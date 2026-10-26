export type ActividadAcademica = {
  id: string;
  titulo: string;
  nota: string | null;
  articulo: number | null;
  esFechaLimite: boolean;
  fechaInicio: string | null;
  fechaFin: string | null;
  periodo: string | null;
  categoria: string | null;
  tematica: string | null;
  responsables: string[];
  audiencias: string[];
};

export type FiltrosCalendario = {
  texto: string;
  desde: string;
  hasta: string;
  categoria: string;
  tematica: string;
  audiencia: string;
  semestres: string[];
};

export const FILTROS_INICIALES: FiltrosCalendario = {
  texto: "",
  desde: "",
  hasta: "",
  categoria: "",
  tematica: "",
  audiencia: "",
  semestres: [],
};

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/**
 * Normaliza texto para búsquedas sin distinguir mayúsculas ni tildes.
 */
export function normalizarTexto(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function formatearFecha(iso: string | null): string {
  if (!iso) return "Fecha por confirmar";

  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day || !MESES[month - 1]) {
    return "Fecha por confirmar";
  }

  return `${day} de ${MESES[month - 1]} de ${year}`;
}

export function formatearRangoFechas(
  inicio: string | null,
  fin: string | null,
): string {
  if (!inicio && !fin) return "Fecha por confirmar";
  if (!inicio) return `Hasta el ${formatearFecha(fin)}`;
  if (!fin || inicio === fin) return formatearFecha(inicio);

  return `${formatearFecha(inicio)} al ${formatearFecha(fin)}`;
}

export function ordenarActividades(
  a: ActividadAcademica,
  b: ActividadAcademica,
): number {
  if (a.fechaInicio && b.fechaInicio) {
    const comparacion = a.fechaInicio.localeCompare(b.fechaInicio);
    if (comparacion !== 0) return comparacion;
  } else if (a.fechaInicio) {
    return -1;
  } else if (b.fechaInicio) {
    return 1;
  }

  return a.titulo.localeCompare(b.titulo, "es");
}

export function filtrarActividades(
  actividades: ActividadAcademica[],
  filtros: FiltrosCalendario,
): ActividadAcademica[] {
  const terminos = normalizarTexto(filtros.texto)
    .split(/\s+/)
    .filter(Boolean);

  return actividades.filter((actividad) => {
    if (
      filtros.semestres.length > 0 &&
      (!actividad.periodo || !filtros.semestres.includes(actividad.periodo))
    ) {
      return false;
    }

    if (filtros.categoria && actividad.categoria !== filtros.categoria) {
      return false;
    }

    if (filtros.tematica && actividad.tematica !== filtros.tematica) {
      return false;
    }

    if (
      filtros.audiencia &&
      !actividad.audiencias.includes(filtros.audiencia)
    ) {
      return false;
    }

    if (filtros.desde && (!actividad.fechaFin || actividad.fechaFin < filtros.desde)) {
      return false;
    }

    if (filtros.hasta && (!actividad.fechaInicio || actividad.fechaInicio > filtros.hasta)) {
      return false;
    }

    if (!terminos.length) return true;

    const contenido = normalizarTexto(
      [
        actividad.titulo,
        actividad.nota ?? "",
        actividad.categoria ?? "",
        actividad.tematica ?? "",
        actividad.periodo ?? "",
        actividad.responsables.join(" "),
        actividad.audiencias.join(" "),
      ].join(" "),
    );

    return terminos.every((termino) => contenido.includes(termino));
  });
}

export function opcionesUnicas(valores: Array<string | null>): string[] {
  return Array.from(
    new Set(valores.filter((valor): valor is string => Boolean(valor))),
  ).sort((a, b) => a.localeCompare(b, "es"));
}

/**
 * Fecha actual (YYYY-MM-DD) en la zona horaria de Bogotá.
 */
export function fechaHoyBogota(fecha: Date = new Date()): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(fecha);

  const valores = Object.fromEntries(
    partes.map((parte) => [parte.type, parte.value]),
  );

  return `${valores.year}-${valores.month}-${valores.day}`;
}

export type EstadoEvento = "abierto" | "finalizado" | "sin-fecha";

/**
 * Un evento sigue abierto mientras su fecha de fin sea hoy o posterior.
 */
export function estadoEvento(
  actividad: ActividadAcademica,
  hoy: string,
): EstadoEvento {
  if (!actividad.fechaFin) return "sin-fecha";

  return actividad.fechaFin < hoy ? "finalizado" : "abierto";
}

/**
 * Devuelve el identificador de color de una categoría de Drupal.
 * El color siempre se acompaña de la etiqueta visible en la tarjeta.
 */
export function slugCategoria(categoria: string | null): string {
  const normalizada = normalizarTexto(categoria ?? "");

  switch (normalizada) {
    case "programacion":
      return "programacion";
    case "plazo o tramite":
      return "plazo-tramite";
    case "evaluacion":
      return "evaluacion";
    case "hito institucional":
      return "hito-institucional";
    case "receso":
      return "receso";
    default:
      return "general";
  }
}
