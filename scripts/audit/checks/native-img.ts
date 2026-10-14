/**
 * Verificación determinista de ausencia de etiquetas `<img>` nativas
 * (Feature: global-standardization-and-cleanup, Property 4).
 *
 * Recorre el árbol fuente ACTIVO del proyecto (excluyendo `.next/` y
 * `node_modules/`, además de otros artefactos de build/VCS) y asegura que
 * NINGÚN archivo `.tsx` contenga una etiqueta de imagen nativa `<img>`. Tras la
 * Fase 4, `Footer` y `Brand` fueron migrados a `next/image`, por lo que el
 * árbol activo debe reportar CERO coincidencias.
 *
 * La detección por archivo delega en la función pura {@link detectarImgNativas},
 * que ancla cada coincidencia a la apertura real de un elemento JSX `<img>`
 * para evitar falsos positivos (el componente `<Image>` de `next/image`, la
 * palabra "image" en cadenas o comentarios, etc.).
 *
 * Diseño orientado a testabilidad: la orquestación recibe la raíz del proyecto,
 * de modo que puede dirigirse a árboles de prueba. Las omisiones (archivos no
 * legibles o binarios) se registran y el recorrido continúa.
 *
 * Requisitos cubiertos: 8.1, 8.4.
 */

import { Dirent, promises as fs } from "node:fs";
import * as path from "node:path";

import {
  detectarImgNativas,
  type OcurrenciaImgNativa,
} from "../detectors/native-img.ts";
import type { Omision } from "../types";

/** Extensión de archivo analizada: solo JSX de TypeScript (`.tsx`). */
const EXTENSION_TSX = ".tsx";

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

/** Opciones de la verificación. */
export interface OpcionesVerificacionImgNativas {
  /**
   * Directorio raíz del proyecto frontend sobre el que operar. Por defecto, el
   * directorio de trabajo actual del proceso. Se parametriza para dirigir el
   * recorrido a árboles de prueba.
   */
  raizProyecto?: string;
}

/**
 * Resultado de la verificación: las etiquetas `<img>` nativas encontradas
 * (vacío cuando el árbol está limpio) y las omisiones acumuladas durante el
 * recorrido.
 */
export interface ResultadoVerificacionImgNativas {
  /** Etiquetas `<img>` nativas detectadas en el árbol fuente activo. */
  imagenes: OcurrenciaImgNativa[];
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
 * acumulando las etiquetas `<img>` nativas y las omisiones. Los directorios de
 * {@link DIRECTORIOS_EXCLUIDOS} se omiten por completo. Solo se analizan
 * archivos `.tsx`.
 */
async function recorrer(
  raizProyecto: string,
  directorioAbsoluto: string,
  imagenes: OcurrenciaImgNativa[],
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
      await recorrer(raizProyecto, rutaAbsoluta, imagenes, omisiones);
      continue;
    }
    if (!entrada.isFile() || path.extname(entrada.name) !== EXTENSION_TSX) {
      continue;
    }

    const archivoPosix = aRutaRelativaPosix(raizProyecto, rutaAbsoluta);
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

    imagenes.push(...detectarImgNativas(contenido, archivoPosix));
  }
}

/**
 * Ejecuta la verificación determinista de ausencia de etiquetas `<img>` nativas
 * sobre el árbol fuente activo del proyecto.
 *
 * @param opciones Raíz del proyecto sobre la que operar.
 * @returns Las etiquetas detectadas (vacío si el árbol está limpio) y las
 *   omisiones acumuladas.
 */
export async function verificarAusenciaImgNativas(
  opciones: OpcionesVerificacionImgNativas = {},
): Promise<ResultadoVerificacionImgNativas> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const imagenes: OcurrenciaImgNativa[] = [];
  const omisiones: Omision[] = [];

  await recorrer(raizProyecto, raizProyecto, imagenes, omisiones);

  // Orden estable del resultado: por archivo y luego por línea.
  imagenes.sort(
    (a, b) => a.archivo.localeCompare(b.archivo) || a.linea - b.linea,
  );

  return { imagenes, omisiones };
}
