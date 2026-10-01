/**
 * Walker de archivos del Sistema_Auditoria.
 *
 * Recorre el árbol de archivos del proyecto frontend (análisis estático, sin
 * ejecutar la app) y recolecta:
 * - Los `page.tsx` bajo `app/`, cada uno con su ruta de aplicación asociada
 *   (Req 1.1).
 * - Los archivos `.tsx` y `.ts` bajo `components/` (Req 1.3).
 *
 * Manejo de errores (Req 1.2, 2.5, 5.6):
 * - Si `app/` no existe o no contiene ningún `page.tsx`, se registra la
 *   ausencia y el recorrido continúa sin interrumpirse.
 * - Si un archivo no existe, no puede leerse o no es texto válido, se registra
 *   una `Omision` con su motivo y el recorrido continúa con el resto.
 */

import { Dirent, promises as fs } from "node:fs";
import * as path from "node:path";

import type { Omision } from "./types";

/**
 * Archivo `page.tsx` recolectado bajo `app/`, con su ruta de aplicación
 * asociada (Req 1.1).
 */
export interface RutaPagina {
  /** Ruta del archivo `page.tsx`, relativa a la raíz del proyecto. */
  archivo: string;
  /** Ruta de aplicación derivada de la ubicación del `page.tsx`. */
  ruta: string;
}

/**
 * Archivo de componente recolectado bajo `components/` (Req 1.3).
 */
export interface ArchivoComponente {
  /** Ruta del archivo, relativa a la raíz del proyecto. */
  archivo: string;
}

/**
 * Resultado del recorrido de FS. Agrupa las rutas de `app/`, los archivos de
 * `components/`, las omisiones encontradas y la señalización de ausencia de
 * rutas en `app/` (Req 1.2).
 */
export interface ResultadoWalk {
  /** `page.tsx` recolectados bajo `app/` con su ruta asociada. */
  rutas: RutaPagina[];
  /** Archivos `.tsx`/`.ts` recolectados bajo `components/`. */
  componentes: ArchivoComponente[];
  /** Archivos omitidos durante el recorrido, con su motivo. */
  omisiones: Omision[];
  /**
   * `true` cuando `app/` no existe o no contiene ningún `page.tsx`. En ese caso
   * `rutas` está vacío y la auditoría debe continuar (Req 1.2).
   */
  ausenciaDeRutas: boolean;
}

/** Opciones del walker. */
export interface OpcionesWalk {
  /**
   * Directorio raíz del proyecto frontend sobre el que operar. Por defecto, el
   * directorio de trabajo actual del proceso. Se parametriza para poder dirigir
   * el recorrido a árboles de prueba.
   */
  raizProyecto?: string;
}

/** Extensiones de archivo de código consideradas en `components/`. */
const EXTENSIONES_COMPONENTE: ReadonlySet<string> = new Set([".ts", ".tsx"]);

/** Nombre del archivo de página de ruta del App Router. */
const ARCHIVO_PAGINA = "page.tsx";

/**
 * Normaliza una ruta de archivo a formato POSIX relativo a la raíz del
 * proyecto, para que las rutas registradas sean estables entre sistemas.
 */
function aRutaRelativaPosix(raizProyecto: string, rutaAbsoluta: string): string {
  const relativa = path.relative(raizProyecto, rutaAbsoluta);
  return relativa.split(path.sep).join("/");
}

/**
 * Deriva la ruta de aplicación a partir de la ubicación de un `page.tsx` dentro
 * de `app/`. El segmento `app/` y el archivo `page.tsx` se eliminan; los
 * segmentos restantes se unen con `/`. La raíz de `app/` corresponde a `/`.
 */
function derivarRutaApp(rutaRelPaginaPosix: string): string {
  const segmentos = rutaRelPaginaPosix.split("/");
  // Quita el segmento inicial `app` y el archivo final `page.tsx`.
  const intermedios = segmentos.slice(1, -1);
  if (intermedios.length === 0) {
    return "/";
  }
  return `/${intermedios.join("/")}`;
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
      return "el archivo no existe";
    }
    if (code === "EACCES" || code === "EPERM") {
      return "el archivo no puede leerse (permiso denegado)";
    }
    return `el archivo no puede leerse (${code})`;
  }
  if (error instanceof Error) {
    return `el archivo no puede leerse (${error.message})`;
  }
  return "el archivo no puede leerse";
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
 * Lee un archivo como texto y, si no existe, no es legible o no es texto
 * válido, registra una `Omision` y devuelve `null`. Garantiza que el recorrido
 * continúe (Req 2.5, 5.6).
 */
async function leerTextoOOmitir(
  raizProyecto: string,
  rutaAbsoluta: string,
  omisiones: Omision[],
): Promise<string | null> {
  const archivo = aRutaRelativaPosix(raizProyecto, rutaAbsoluta);
  let contenido: string;
  try {
    contenido = await fs.readFile(rutaAbsoluta, "utf8");
  } catch (error: unknown) {
    omisiones.push({ archivo, motivo: motivoDesdeError(error) });
    return null;
  }
  if (!esTextoValido(contenido)) {
    omisiones.push({ archivo, motivo: "el archivo no es texto válido" });
    return null;
  }
  return contenido;
}

/**
 * Lee las entradas de un directorio. Si el directorio no puede leerse, registra
 * una `Omision` y devuelve una lista vacía para no interrumpir el recorrido.
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
 * Recorre recursivamente un directorio y devuelve las rutas absolutas de los
 * archivos regulares que satisfacen `incluyeArchivo`. Los subdirectorios
 * inaccesibles se registran como omisiones y se omiten.
 */
async function recolectarArchivos(
  raizProyecto: string,
  directorioAbsoluto: string,
  incluyeArchivo: (nombre: string) => boolean,
  omisiones: Omision[],
): Promise<string[]> {
  const encontrados: string[] = [];
  const entradas = await leerDirectorioOOmitir(
    raizProyecto,
    directorioAbsoluto,
    omisiones,
  );
  for (const entrada of entradas) {
    const rutaAbsoluta = path.join(directorioAbsoluto, entrada.name);
    if (entrada.isDirectory()) {
      const anidados = await recolectarArchivos(
        raizProyecto,
        rutaAbsoluta,
        incluyeArchivo,
        omisiones,
      );
      encontrados.push(...anidados);
    } else if (entrada.isFile() && incluyeArchivo(entrada.name)) {
      encontrados.push(rutaAbsoluta);
    }
  }
  return encontrados;
}

/**
 * Comprueba si una ruta de directorio existe y es un directorio accesible.
 */
async function esDirectorioAccesible(rutaAbsoluta: string): Promise<boolean> {
  try {
    const stats = await fs.stat(rutaAbsoluta);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Recorre `app/` y `components/` del proyecto frontend y recolecta las rutas
 * (`page.tsx`) y los archivos de componente (`.tsx`/`.ts`), registrando
 * omisiones y la ausencia de rutas sin interrumpir el recorrido.
 */
export async function walk(opciones: OpcionesWalk = {}): Promise<ResultadoWalk> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const omisiones: Omision[] = [];

  // --- Recorrido de app/ (Req 1.1, 1.2) ---
  const directorioApp = path.join(raizProyecto, "app");
  let rutas: RutaPagina[] = [];
  const appAccesible = await esDirectorioAccesible(directorioApp);
  if (appAccesible) {
    const archivosPagina = await recolectarArchivos(
      raizProyecto,
      directorioApp,
      (nombre) => nombre === ARCHIVO_PAGINA,
      omisiones,
    );
    rutas = archivosPagina
      .map((rutaAbsoluta): RutaPagina => {
        const archivo = aRutaRelativaPosix(raizProyecto, rutaAbsoluta);
        return { archivo, ruta: derivarRutaApp(archivo) };
      })
      .sort((a, b) => a.archivo.localeCompare(b.archivo));
  }
  // Ausencia de rutas: `app/` no existe o no contiene ningún `page.tsx`.
  const ausenciaDeRutas = rutas.length === 0;

  // --- Recorrido de components/ (Req 1.3) ---
  const directorioComponentes = path.join(raizProyecto, "components");
  let componentes: ArchivoComponente[] = [];
  const componentesAccesible = await esDirectorioAccesible(directorioComponentes);
  if (componentesAccesible) {
    const archivos = await recolectarArchivos(
      raizProyecto,
      directorioComponentes,
      (nombre) => EXTENSIONES_COMPONENTE.has(path.extname(nombre)),
      omisiones,
    );
    componentes = archivos
      .map(
        (rutaAbsoluta): ArchivoComponente => ({
          archivo: aRutaRelativaPosix(raizProyecto, rutaAbsoluta),
        }),
      )
      .sort((a, b) => a.archivo.localeCompare(b.archivo));
  }

  return { rutas, componentes, omisiones, ausenciaDeRutas };
}

export { leerTextoOOmitir };
