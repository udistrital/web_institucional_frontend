import type { JsonApiResponse } from "next-drupal";
import { drupal } from "./drupal";
import {
  ordenarActividades,
  type ActividadAcademica,
} from "./calendario-academico";

type ReferenciaTermino = {
  id?: string;
  name?: string;
};

type ActividadDrupal = {
  id: string;
  title?: string;
  field_titulo?: string | null;
  field_nota?: string | null;
  field_articulo?: number | null;
  field_es_fecha_limite?: boolean | null;
  field_fechas?: string[] | null;
  field_periodo?: ReferenciaTermino | null;
  field_categoria?: ReferenciaTermino | null;
  field_tematica?: ReferenciaTermino | null;
  field_responsables?: ReferenciaTermino[] | null;
  field_audiencia?: ReferenciaTermino[] | null;
};

export type ResultadoActividades = {
  actividades: ActividadAcademica[];
  noDisponible: boolean;
};

const TIPO_CONTENIDO = "node--actividad_academica";

const PARAMETROS = {
  "filter[status]": "1",
  include:
    "field_periodo,field_categoria,field_tematica,field_responsables,field_audiencia",
  sort: "field_fechas,id",
  "page[limit]": "50",
};

const OPCIONES_CACHE: { cache?: RequestCache; next?: { revalidate: number } } =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { next: { revalidate: 3600 } };

function nombreTermino(termino?: ReferenciaTermino | null): string | null {
  const nombre = termino?.name?.trim();
  return nombre || null;
}

function nombresTerminos(
  terminos?: ReferenciaTermino[] | null,
): string[] {
  return (terminos ?? [])
    .map((termino) => termino?.name?.trim())
    .filter((nombre): nombre is string => Boolean(nombre));
}

function normalizarActividad(recurso: ActividadDrupal): ActividadAcademica {
  const fechas = (recurso.field_fechas ?? [])
    .filter(Boolean)
    .slice()
    .sort();

  const fechaInicio = fechas[0] ?? null;
  const fechaFin = fechas.length ? fechas[fechas.length - 1] : null;

  return {
    id: recurso.id,
    titulo:
      (recurso.field_titulo || recurso.title || "").trim() ||
      "Actividad académica",
    nota: recurso.field_nota?.trim() || null,
    articulo:
      typeof recurso.field_articulo === "number" ? recurso.field_articulo : null,
    esFechaLimite: Boolean(recurso.field_es_fecha_limite),
    fechaInicio,
    fechaFin,
    periodo: nombreTermino(recurso.field_periodo),
    categoria: nombreTermino(recurso.field_categoria),
    tematica: nombreTermino(recurso.field_tematica),
    responsables: nombresTerminos(recurso.field_responsables),
    audiencias: nombresTerminos(recurso.field_audiencia),
  };
}

async function getPagina(
  href: string,
): Promise<JsonApiResponse> {
  const respuesta = await drupal.fetch(href, OPCIONES_CACHE);

  if (!respuesta.ok) {
    throw new Error(
      `Drupal respondió con HTTP ${respuesta.status} al consultar las actividades académicas.`,
    );
  }

  return (await respuesta.json()) as JsonApiResponse;
}

function obtenerSiguientePagina(pagina: JsonApiResponse): string | null {
  const siguiente = pagina.links?.next;

  if (!siguiente || typeof siguiente === "string") return null;

  return typeof siguiente.href === "string" ? siguiente.href : null;
}

/**
 * Obtiene todas las actividades académicas publicadas.
 * Drupal limita cada página a 50 resultados, por eso se recorren enlaces `next`.
 */
export async function getActividadesAcademicas(): Promise<ActividadAcademica[]> {
  let pagina = await drupal.getResourceCollection<JsonApiResponse>(
    TIPO_CONTENIDO,
    {
      params: PARAMETROS,
      deserialize: false,
      ...OPCIONES_CACHE,
    },
  );

  const recursos: ActividadDrupal[] = [];
  let paginas = 0;

  while (true) {
    recursos.push(...(drupal.deserialize(pagina) as ActividadDrupal[]));

    const siguiente = obtenerSiguientePagina(pagina);
    if (!siguiente) break;

    paginas += 1;
    if (paginas > 100) {
      throw new Error(
        "Se superó el límite de páginas al consultar las actividades académicas.",
      );
    }

    pagina = await getPagina(siguiente);
  }

  const recursosUnicos = Array.from(
    new Map(recursos.map((recurso) => [recurso.id, recurso])).values(),
  );

  return recursosUnicos.map(normalizarActividad).sort(ordenarActividades);
}

/**
 * Carga las actividades para la página. En desarrollo devuelve un estado
 * controlado; durante la exportación de producción falla para no publicar
 * un calendario vacío por un error de Drupal.
 */
export async function cargarActividadesAcademicas(): Promise<ResultadoActividades> {
  try {
    return {
      actividades: await getActividadesAcademicas(),
      noDisponible: false,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;

    console.error(
      "No se pudieron cargar las actividades académicas desde Drupal:",
      error,
    );

    return { actividades: [], noDisponible: true };
  }
}
