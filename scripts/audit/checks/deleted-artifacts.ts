/**
 * Verificación determinista de ausencia de referencias a Artefactos_Eliminados
 * (Feature: global-standardization-and-cleanup, Property 3).
 *
 * Recorre el árbol fuente ACTIVO del proyecto (excluyendo `.next/` y
 * `node_modules/`, además de otros artefactos de build/VCS) y asegura que NO
 * exista ninguna referencia de importación / ruta de módulo a los artefactos
 * eliminados en la Fase 1:
 *
 * - `components/article`
 * - `services/articles`
 * - `services/articles.types`
 * - `app/[...slug]`
 *
 * La detección por archivo delega en la función pura
 * {@link detectarArtefactosEliminados}, que ancla cada coincidencia a un
 * especificador de módulo o segmento de ruta para evitar falsos positivos
 * (etiqueta HTML `<article>`, el tipo de contenido Drupal `node/article`,
 * ejemplos en comentarios, etc.).
 *
 * Diseño orientado a testabilidad: la orquestación recibe la raíz del proyecto,
 * de modo que puede dirigirse a árboles de prueba. Las omisiones (archivos no
 * legibles o binarios) se registran y el recorrido continúa.
 *
 * Requisitos cubiertos: 2.4.
 */

import { Dirent, promises as fs } from "node:fs";
import * as path from "node:path";

import {
  detectarArtefactosEliminados,
  type OcurrenciaArtefactoEliminado,
} from "../detectors/deleted-artifacts.ts";
import type { Omision } from "../types";

/** Extensiones de archivo de código fuente analizadas. */
const EXTENSIONES_FUENTE: ReadonlySet<string> = new Set([
  ".ts",
  ".tsx",
  ".mts",
  ".cts",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
]);

/**
 * Directorios excluidos del recorrido por no formar parte del árbol fuente
 * activo: salida de build de Next.js, dependencias y metadatos de VCS/IDE.
 */
const DIRECTORIOS_EXCLUIDOS: ReadonlySet<string> = new Set([
  ".next",
  "node_modules",
  ".git",
  "coverage",
  "dist",
  "build",
  "out",
]);

/**
 * Archivos de la propia herramienta de auditoría que contienen, de forma
 * intencionada, los especificadores de los Artefactos_Eliminados como DATOS:
 * el detector los define en sus patrones/documentación y el test los usa como
 * fixtures de entrada. No son referencias de importación reales a los
 * artefactos borrados, por lo que se excluyen del escaneo del árbol activo
 * (coherente con tratar "ejemplos en scripts de auditoría" como no-referencias).
 * Rutas POSIX relativas a la raíz del proyecto.
 */
const ARCHIVOS_HERRAMIENTA_EXCLUIDOS: ReadonlySet<string> = new Set([
  "scripts/audit/detectors/deleted-artifacts.ts",
  "scripts/audit/checks/deleted-artifacts.ts",
  "scripts/audit/checks/deleted-artifacts.test.ts",
]);

/** Opciones de la verificación. */
export interface OpcionesVerificacionArtefactos {
  /**
   * Directorio raíz del proyecto frontend sobre el que operar. Por defecto, el
   * directorio de trabajo actual del proceso. Se parametriza para dirigir el
   * recorrido a árboles de prueba.
   */
  raizProyecto?: string;
}

/**
 * Resultado de la verificación: las referencias encontradas (vacío cuando el
 * árbol está limpio) y las omisiones acumuladas durante el recorrido.
 */
export interface ResultadoVerificacionArtefactos {
  /** Referencias a artefactos eliminados detectadas en el árbol fuente activo. */
  referencias: OcurrenciaArtefactoEliminado[];
  /** Archivos/directorios omitidos durante el recorrido, con su motivo. */
  omisiones: Omision[];
}

/**
 * Convierte una ruta absoluta a POSIX relativa a la raíz del proyecto, para que
 * las rutas registradas sean estables entre sistemas.
 */
function aRutaRelativaPosix(raizProyecto: string, rutaAbsoluta: string): string {
  return path.relative(raizProyecto, rutaAbsoluta).split(path.sep).join("/");
}

/**
 * Determina el motivo de omisión para un error del sistema de archivos.
 */
function motivoDesdeError(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  ) {
    const code = (error as { code: string }).code;
    if (code === "ENOENT") {
      return "no existe";
    }
    if (code === "EACCES" || code === "EPERM") {
      return "no puede leerse (permiso denegado)";
    }
    return `no puede leerse (${code})`;
  }
  if (error instanceof Error) {
    return `no puede leerse (${error.message})`;
  }
  return "no puede leerse";
}

/**
 * Comprueba que el contenido de un archivo es texto válido. Node sustituye los
 * bytes inválidos de UTF-8 por el carácter de reemplazo U+FFFD al decodificar,
 * por lo que su presencia indica contenido no textual (binario).
 */
function esTextoValido(contenido: string): boolean {
  return !contenido.includes("\uFFFD");
}

/**
 * Lee las entradas de un directorio. Si no puede leerse, registra una `Omision`
 * y devuelve una lista vacía para no interrumpir el recorrido.
 */
async function leerDirectorioOOmitir(
  raizProyecto: string,
  directorioAbsoluto: string,
  omisiones: Omision[],
): Promise<Dirent[]> {
  try {
    return await fs.readdir(directorioAbsoluto, { withFileTypes: true });
  } catch (error: unknown) {
    omisiones.push({
      archivo: aRutaRelativaPosix(raizProyecto, directorioAbsoluto),
      motivo: motivoDesdeError(error),
    });
    return [];
  }
}

/**
 * Recorre recursivamente el árbol fuente activo a partir de un directorio,
 * acumulando las referencias a artefactos eliminados y las omisiones. Los
 * directorios de {@link DIRECTORIOS_EXCLUIDOS} se omiten por completo.
 */
async function recorrer(
  raizProyecto: string,
  directorioAbsoluto: string,
  referencias: OcurrenciaArtefactoEliminado[],
  omisiones: Omision[],
): Promise<void> {
  const entradas = await leerDirectorioOOmitir(
    raizProyecto,
    directorioAbsoluto,
    omisiones,
  );

  for (const entrada of entradas) {
    const rutaAbsoluta = path.join(directorioAbsoluto, entrada.name);
    if (entrada.isDirectory()) {
      if (DIRECTORIOS_EXCLUIDOS.has(entrada.name)) {
        continue;
      }
      await recorrer(raizProyecto, rutaAbsoluta, referencias, omisiones);
      continue;
    }
    if (!entrada.isFile() || !EXTENSIONES_FUENTE.has(path.extname(entrada.name))) {
      continue;
    }

    const archivoPosix = aRutaRelativaPosix(raizProyecto, rutaAbsoluta);
    // La propia herramienta de auditoría incrusta los especificadores como
    // datos (patrones del detector y fixtures del test); no son referencias
    // reales a los artefactos eliminados.
    if (ARCHIVOS_HERRAMIENTA_EXCLUIDOS.has(archivoPosix)) {
      continue;
    }
    let contenido: string;
    try {
      contenido = await fs.readFile(rutaAbsoluta, "utf8");
    } catch (error: unknown) {
      omisiones.push({ archivo: archivoPosix, motivo: motivoDesdeError(error) });
      continue;
    }
    if (!esTextoValido(contenido)) {
      omisiones.push({ archivo: archivoPosix, motivo: "no es texto válido" });
      continue;
    }

    referencias.push(...detectarArtefactosEliminados(contenido, archivoPosix));
  }
}

/**
 * Ejecuta la verificación determinista de ausencia de referencias a los
 * Artefactos_Eliminados sobre el árbol fuente activo del proyecto.
 *
 * @param opciones Raíz del proyecto sobre la que operar.
 * @returns Las referencias detectadas (vacío si el árbol está limpio) y las
 *   omisiones acumuladas.
 */
export async function verificarAusenciaArtefactosEliminados(
  opciones: OpcionesVerificacionArtefactos = {},
): Promise<ResultadoVerificacionArtefactos> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const referencias: OcurrenciaArtefactoEliminado[] = [];
  const omisiones: Omision[] = [];

  await recorrer(raizProyecto, raizProyecto, referencias, omisiones);

  // Orden estable del resultado: por archivo y luego por línea.
  referencias.sort(
    (a, b) => a.archivo.localeCompare(b.archivo) || a.linea - b.linea,
  );

  return { referencias, omisiones };
}
