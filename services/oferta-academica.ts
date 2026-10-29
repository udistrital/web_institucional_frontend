import "server-only";

import type { JsonApiResponse } from "next-drupal";
import {
  crearNivelesFiltro,
  nivelParaFiltro,
  type ProgramaAcademico,
  type ResultadoOfertaAcademica,
} from "@/lib/oferta-academica";
import { getPublicBaseUrl, resolveUrl } from "./api";
import { createDrupalClient } from "./drupal-client";

export type { ProgramaAcademico, ResultadoOfertaAcademica } from "@/lib/oferta-academica";

const drupal = createDrupalClient();

type ReferenciaTermino = { name?: string | null } | null;

type ArchivoDrupal = {
  uri?: { url?: string | null } | null;
  resourceIdObjMeta?: { alt?: string | null } | null;
} | null;

type ProgramaDrupal = {
  id: string;
  title?: string | null;
  field_nombre_programa?: string | null;
  field_pagina_programa?: { uri?: string | null } | null;
  field_facultad?: ReferenciaTermino;
  field_tipo_formacion?: ReferenciaTermino;
  field_jornada_del_programa?: ReferenciaTermino;
  field_modalidad_del_programa?: ReferenciaTermino;
  field_titulacion?: string | null;
  field_acreditacion_alta_calidad?: boolean | null;
  field_coordinador?: string | null;
  field_correo_programa?: string | null;
  field_direccion_programa?: string | null;
  field_horario_atencion_programa?: string | null;
  field_imagen_oferta_academica?: ArchivoDrupal;
  field_norma_interna_de_creacion?: ArchivoDrupal;
  field_norma_interna_descripcion?: string | null;
  field_registro_calificado?: ArchivoDrupal;
  field_reg_calificado_descripcion?: string | null;
  field_puntaje_saber_11?: string | null;
  field_snies?: number | string | null;
  field_telefono_programa?: string | null;
};

type TerminoDrupal = { name?: string | null };

const OPCIONES_CACHE: RequestInit =
  process.env.NODE_ENV === "development"
    ? { cache: "no-store" }
    : { next: { revalidate: 3600 } };

const PARAMETROS_PROGRAMA = {
  "filter[status]": "1",
  include: [
    "field_facultad",
    "field_jornada_del_programa",
    "field_modalidad_del_programa",
    "field_tipo_formacion",
    "field_imagen_oferta_academica",
    "field_norma_interna_de_creacion",
    "field_registro_calificado",
  ].join(","),
  sort: "field_nombre_programa",
  "page[limit]": "50",
};

function texto(valor: unknown): string | null {
  if (typeof valor === "string") return valor.trim() || null;
  if (typeof valor === "number") return String(valor);
  if (valor && typeof valor === "object") {
    const campo = valor as { value?: unknown; processed?: unknown };
    return texto(campo.value) ?? texto(campo.processed);
  }
  return null;
}

function nombreTermino(termino?: ReferenciaTermino): string | null {
  return termino?.name?.trim() || null;
}

function urlPrograma(uri?: string | null): string | null {
  if (!uri?.trim()) return null;

  let enlace = uri.trim();
  if (/^internal:/i.test(enlace)) enlace = enlace.replace(/^internal:/i, "");
  if (/^entity:node\//i.test(enlace)) {
    enlace = `/node/${enlace.slice("entity:node/".length)}`;
  }

  try {
    const url = new URL(enlace, getPublicBaseUrl());
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function normalizarPrograma(recurso: ProgramaDrupal): ProgramaAcademico {
  const nombre = texto(recurso.field_nombre_programa) || "Programa académico";
  const nivel = nombreTermino(recurso.field_tipo_formacion);
  const snies = texto(recurso.field_snies);
  const numeroSnies = snies ? Number(snies) : null;
  const imagen = recurso.field_imagen_oferta_academica;

  return {
    id: recurso.id,
    nombre,
    paginaProgramaUrl: urlPrograma(recurso.field_pagina_programa?.uri),
    facultad: nombreTermino(recurso.field_facultad),
    nivel,
    nivelFiltro: nivelParaFiltro(nivel),
    jornada: nombreTermino(recurso.field_jornada_del_programa),
    modalidad: nombreTermino(recurso.field_modalidad_del_programa),
    titulacion: texto(recurso.field_titulacion),
    acreditacionAltaCalidad: recurso.field_acreditacion_alta_calidad === true,
    coordinador: texto(recurso.field_coordinador),
    correo: texto(recurso.field_correo_programa),
    direccion: texto(recurso.field_direccion_programa),
    horarioAtencion: texto(recurso.field_horario_atencion_programa),
    imagenUrl: resolveUrl(imagen?.uri?.url ?? undefined, getPublicBaseUrl()),
    imagenAlt: imagen?.resourceIdObjMeta?.alt?.trim() || nombre,
    normaInternaUrl: resolveUrl(
      recurso.field_norma_interna_de_creacion?.uri?.url ?? undefined,
      getPublicBaseUrl(),
    ),
    normaInternaDescripcion: texto(recurso.field_norma_interna_descripcion),
    registroCalificadoUrl: resolveUrl(
      recurso.field_registro_calificado?.uri?.url ?? undefined,
      getPublicBaseUrl(),
    ),
    registroCalificadoDescripcion: texto(recurso.field_reg_calificado_descripcion),
    puntajeSaber11: texto(recurso.field_puntaje_saber_11),
    snies:
      numeroSnies !== null && Number.isFinite(numeroSnies) ? numeroSnies : null,
    telefono: texto(recurso.field_telefono_programa),
  };
}

async function obtenerPagina(url: string): Promise<JsonApiResponse> {
  const respuesta = await drupal.fetch(url, OPCIONES_CACHE);
  if (!respuesta.ok) {
    throw new Error(`Drupal respondió con HTTP ${respuesta.status}.`);
  }
  return (await respuesta.json()) as JsonApiResponse;
}

function obtenerSiguiente(pagina: JsonApiResponse): string | null {
  const enlace = pagina.links?.next;
  if (typeof enlace === "string") return enlace;
  return enlace?.href ?? null;
}

async function obtenerColeccion<T>(
  tipo: string,
  params: Record<string, string>,
): Promise<T[]> {
  let pagina = await drupal.getResourceCollection<JsonApiResponse>(tipo, {
    params,
    deserialize: false,
    ...OPCIONES_CACHE,
  });
  const recursos: T[] = [];
  let paginas = 0;

  while (true) {
    recursos.push(...(drupal.deserialize(pagina) as T[]));
    const siguiente = obtenerSiguiente(pagina);
    if (!siguiente) return recursos;

    paginas++;
    if (paginas > 100) throw new Error("Se superó el límite de páginas de Drupal.");
    pagina = await obtenerPagina(siguiente);
  }
}

async function obtenerProgramas(): Promise<ProgramaAcademico[]> {
  const recursos = await obtenerColeccion<ProgramaDrupal>(
    "node--oferta_academica",
    PARAMETROS_PROGRAMA,
  );
  const ids = new Set<string>();

  return recursos
    .filter((recurso) => {
      if (!recurso.id || ids.has(recurso.id)) return false;
      ids.add(recurso.id);
      return true;
    })
    .map(normalizarPrograma);
}

async function obtenerTerminosVocabulario(vocabulario: string): Promise<string[]> {
  const terminos = await obtenerColeccion<TerminoDrupal>(
    `taxonomy_term--${vocabulario}`,
    { sort: "name", "page[limit]": "100" },
  );
  return terminos
    .map((termino) => texto(termino.name))
    .filter((nombre): nombre is string => Boolean(nombre));
}

export async function cargarOfertaAcademica(): Promise<ResultadoOfertaAcademica> {
  const [
    resultadoProgramas,
    resultadoNiveles,
    resultadoModalidades,
    resultadoJornadas,
  ] = await Promise.allSettled([
    obtenerProgramas(),
    obtenerTerminosVocabulario("nivel_de_formacion"),
    obtenerTerminosVocabulario("modalidad_programa"),
    obtenerTerminosVocabulario("jornada_programa"),
  ]);

  if (resultadoProgramas.status === "rejected") {
    console.error("No se pudo cargar la oferta académica desde Drupal:", resultadoProgramas.reason);
  }
  if (resultadoNiveles.status === "rejected") {
    console.error("No se pudieron cargar los niveles de formación:", resultadoNiveles.reason);
  }
  if (resultadoModalidades.status === "rejected") {
    console.error("No se pudieron cargar las modalidades:", resultadoModalidades.reason);
  }
  if (resultadoJornadas.status === "rejected") {
    console.error("No se pudieron cargar las jornadas:", resultadoJornadas.reason);
  }

  const programas = resultadoProgramas.status === "fulfilled" ? resultadoProgramas.value : [];
  const nivelesFormacion =
    resultadoNiveles.status === "fulfilled"
      ? resultadoNiveles.value
      : programas.map((programa) => programa.nivel).filter((nivel): nivel is string => Boolean(nivel));
  const modalidades =
    resultadoModalidades.status === "fulfilled"
      ? resultadoModalidades.value
      : [...new Set(programas.map((programa) => programa.modalidad).filter((value): value is string => Boolean(value)))];
  const jornadas =
    resultadoJornadas.status === "fulfilled"
      ? resultadoJornadas.value
      : [...new Set(programas.map((programa) => programa.jornada).filter((value): value is string => Boolean(value)))];

  return {
    programas,
    nivelesFormacion,
    nivelesFiltro: crearNivelesFiltro([
      ...nivelesFormacion,
      ...programas.map((programa) => programa.nivel ?? ""),
    ]),
    modalidades,
    jornadas,
    noDisponible: resultadoProgramas.status === "rejected",
  };
}
