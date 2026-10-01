/**
 * Chequeo estructural de componentes del Sistema_Auditoria
 * (skill de estandarización de componentes / regla 4: Componentización).
 *
 * Verifica, por cada componente analizado, los cuatro elementos de la
 * Estructura_Componente exigidos por la skill de estandarización y la Req 5:
 *
 * 1. Existe un archivo `[NombreComponente].tsx` cuyo nombre en PascalCase
 *    coincide con el nombre del directorio del componente (Req 5.1).
 * 2. El directorio del componente contiene `[NombreComponente].types.ts`
 *    (Req 5.2).
 * 3. El directorio del componente contiene un barrel `index.ts` que exporta el
 *    componente (Req 5.3).
 * 4. Las `props` del componente incluyen soporte para una propiedad opcional
 *    `className?: string` (Req 5.4).
 *
 * Por cada elemento incumplido se registra un `Hallazgo` independiente con la
 * ruta del componente y el criterio incumplido (Req 5.5), bajo la regla
 * `"skill-estandarizacion"`. Si un directorio o archivo del componente no puede
 * leerse, se registra una `Omision` con su motivo y el análisis continúa con los
 * componentes restantes (Req 5.6).
 *
 * Diseño orientado a testabilidad: la identificación del nombre esperado del
 * componente (`nombreComponenteEsperado`) y las detecciones textuales sobre
 * contenido (`exportaComponente`, `declaraClassNameOpcional`) son **funciones
 * puras** que no tocan el sistema de archivos. La orquestación
 * (`chequearEstructura`) recorre `components/`, agrupa los archivos por
 * directorio de componente y agrega los hallazgos y omisiones.
 *
 * Requisitos cubiertos: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6.
 */

import { Dirent, promises as fs } from "node:fs";
import * as path from "node:path";

import type { Hallazgo, Omision } from "../types";

/** Regla de arquitectura bajo la que se agrupan los hallazgos de este chequeo. */
const REGLA = "skill-estandarizacion" as const;

/** Directorio raíz de componentes analizado por el chequeo. */
const DIRECTORIO_COMPONENTES = "components";

/** Nombre del barrel exigido por la Estructura_Componente. */
const ARCHIVO_BARREL = "index.ts";

/**
 * Criterio de la Estructura_Componente evaluado por el chequeo. Permite al
 * generador del informe distinguir con precisión qué elemento se incumplió.
 */
export type CriterioEstructura =
  | "nombre-tsx"
  | "archivo-types"
  | "barrel-index"
  | "prop-classname";

/**
 * Convierte un nombre de directorio a su forma PascalCase canónica. Divide por
 * los separadores habituales (`-`, `_`, espacios) y por los límites de camelCase
 * ya existentes, y capitaliza la inicial de cada segmento. Por ejemplo:
 * `news-list` → `NewsList`, `contact_widget` → `ContactWidget`,
 * `heroCarousel` → `HeroCarousel`, `article` → `Article`.
 */
export function aPascalCase(nombre: string): string {
  const conSeparadores = nombre
    // Inserta un separador en los límites camelCase para preservarlos.
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[-_\s]+/)
    .filter((segmento) => segmento.length > 0);
  return conSeparadores
    .map((segmento) => segmento.charAt(0).toUpperCase() + segmento.slice(1))
    .join("");
}

/**
 * Nombre de componente esperado (en PascalCase) para un directorio dado, según
 * la Req 5.1 (el `NombreComponente` del archivo `[NombreComponente].tsx` debe
 * coincidir en PascalCase con el nombre del directorio). Función pura.
 */
export function nombreComponenteEsperado(nombreDirectorio: string): string {
  return aPascalCase(nombreDirectorio);
}

/**
 * Indica si un nombre de archivo (sin ruta) está en PascalCase, es decir,
 * empieza por mayúscula y solo contiene caracteres alfanuméricos. Se usa para
 * identificar los archivos candidatos a ser el componente principal del
 * directorio (p. ej. `NewsList.tsx`, `Article.tsx`), descartando archivos
 * auxiliares en minúscula (`home.module.css`, `useSwipe.ts`, `brand.tsx`).
 */
export function esNombrePascalCase(nombreBase: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(nombreBase);
}

/**
 * Expresión que reconoce un barrel que reexporta el componente mediante
 * `export { default as Nombre } from "./Nombre"` o
 * `export { default } from "./Nombre"`, admitiendo comillas simples o dobles y
 * la extensión opcional. También admite `export { Nombre } from "./Nombre"`.
 */
function construirExpresionReexport(nombreComponente: string): RegExp {
  const nombreEscapado = nombreComponente.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    String.raw`export\s*\{[^}]*\b(?:default(?:\s+as\s+${nombreEscapado})?|${nombreEscapado})\b[^}]*\}\s*from\s*["']\.\/${nombreEscapado}(?:\.tsx?)?["']`,
  );
}

/**
 * Determina si el contenido de un barrel `index.ts` exporta el componente
 * indicado (Req 5.3). Función pura. Reconoce las formas de reexport habituales
 * del patrón barrel (`export { default as Nombre } from "./Nombre"`), así como
 * una reexportación total `export * from "./Nombre"`.
 *
 * @param contenido Contenido textual del `index.ts`.
 * @param nombreComponente Nombre del componente que debe exportarse.
 * @returns `true` si el barrel exporta el componente.
 */
export function exportaComponente(
  contenido: string,
  nombreComponente: string,
): boolean {
  if (construirExpresionReexport(nombreComponente).test(contenido)) {
    return true;
  }
  const nombreEscapado = nombreComponente.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expresionEstrella = new RegExp(
    String.raw`export\s*\*\s*from\s*["']\.\/${nombreEscapado}(?:\.tsx?)?["']`,
  );
  return expresionEstrella.test(contenido);
}

/**
 * Determina si un contenido TypeScript declara soporte para una propiedad
 * opcional `className?: string` en las props del componente (Req 5.4). Función
 * pura y textual.
 *
 * Reconoce dos formas:
 * - Declaración explícita de la propiedad opcional de tipo `string`
 *   (`className?: string`), admitiendo espacios variables.
 * - Extensión de un tipo que ya aporta `className` opcional, como
 *   `React.HTMLAttributes<...>`, `ComponentPropsWithoutRef<...>` o
 *   `HTMLProps<...>`, que incluyen `className?: string` en su definición.
 */
export function declaraClassNameOpcional(contenido: string): boolean {
  const declaracionExplicita = /\bclassName\s*\?\s*:\s*string\b/;
  if (declaracionExplicita.test(contenido)) {
    return true;
  }
  const extiendeAtributosHtml =
    /\b(?:HTMLAttributes|ComponentPropsWithoutRef|ComponentProps|HTMLProps|DetailedHTMLProps)\s*</;
  return extiendeAtributosHtml.test(contenido);
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
 * Lee un archivo como texto. Devuelve el contenido o `null` si no existe, no es
 * legible o no es texto válido, registrando en ese caso una `Omision` con su
 * motivo para no interrumpir el análisis (Req 5.6).
 */
async function leerArchivoOOmitir(
  rutaAbsoluta: string,
  archivoPosix: string,
  omisiones: Omision[],
): Promise<string | null> {
  let contenido: string;
  try {
    contenido = await fs.readFile(rutaAbsoluta, "utf8");
  } catch (error: unknown) {
    omisiones.push({ archivo: archivoPosix, motivo: motivoDesdeError(error) });
    return null;
  }
  if (!esTextoValido(contenido)) {
    omisiones.push({ archivo: archivoPosix, motivo: "no es texto válido" });
    return null;
  }
  return contenido;
}

/** Opciones del chequeo estructural de componentes. */
export interface OpcionesChequeoEstructura {
  /**
   * Directorio raíz del proyecto frontend sobre el que operar. Debe coincidir
   * con el usado por `walk`/`construirInventario` para que las rutas relativas
   * sean consistentes. Por defecto, el directorio de trabajo actual.
   */
  raizProyecto?: string;
}

/**
 * Resultado del chequeo estructural: los hallazgos de la regla y las omisiones
 * acumuladas al leer directorios/archivos de componente.
 */
export interface ResultadoChequeoEstructura {
  /** Hallazgos detectados bajo la regla `"skill-estandarizacion"`. */
  hallazgos: Hallazgo[];
  /** Archivos/directorios omitidos durante el chequeo, con su motivo. */
  omisiones: Omision[];
}

/**
 * Convierte una ruta absoluta a POSIX relativo a la raíz del proyecto, para que
 * las rutas registradas sean estables entre sistemas.
 */
function aRutaRelativaPosix(raizProyecto: string, rutaAbsoluta: string): string {
  return path.relative(raizProyecto, rutaAbsoluta).split(path.sep).join("/");
}

/**
 * Lee las entradas de un directorio. Si no puede leerse, registra una `Omision`
 * y devuelve `null` para que el llamador lo omita y continúe (Req 5.6).
 */
async function leerDirectorioOOmitir(
  raizProyecto: string,
  directorioAbsoluto: string,
  omisiones: Omision[],
): Promise<Dirent[] | null> {
  try {
    return await fs.readdir(directorioAbsoluto, { withFileTypes: true });
  } catch (error: unknown) {
    omisiones.push({
      archivo: aRutaRelativaPosix(raizProyecto, directorioAbsoluto),
      motivo: motivoDesdeError(error),
    });
    return null;
  }
}

/** Construye un hallazgo de criterio estructural incumplido (Req 5.5). */
function hallazgoCriterio(
  componentePosix: string,
  criterio: CriterioEstructura,
  descripcion: string,
  remediacion: string,
): Hallazgo {
  return {
    regla: REGLA,
    archivo: componentePosix,
    severidad: "media",
    descripcion: `[${criterio}] ${descripcion}`,
    remediacion,
  };
}

/**
 * Analiza un único directorio de componente (identificado por un archivo
 * `[Nombre].tsx` en PascalCase) y acumula los hallazgos por cada criterio de la
 * Estructura_Componente incumplido.
 *
 * @param raizProyecto Raíz del proyecto para relativizar rutas.
 * @param directorioAbsoluto Ruta absoluta del directorio del componente.
 * @param nombresEnDirectorio Nombres de archivo presentes en el directorio.
 * @param archivoComponente Nombre del archivo `[Nombre].tsx` principal.
 * @param hallazgos Acumulador de hallazgos.
 * @param omisiones Acumulador de omisiones.
 */
async function analizarComponente(
  raizProyecto: string,
  directorioAbsoluto: string,
  nombresEnDirectorio: ReadonlySet<string>,
  archivoComponente: string,
  hallazgos: Hallazgo[],
  omisiones: Omision[],
): Promise<void> {
  const nombreDirectorio = path.basename(directorioAbsoluto);
  const nombreComponente = path.basename(archivoComponente, ".tsx");
  const componentePosix = aRutaRelativaPosix(
    raizProyecto,
    path.join(directorioAbsoluto, archivoComponente),
  );
  const directorioPosix = aRutaRelativaPosix(raizProyecto, directorioAbsoluto);

  // --- Criterio 1: [Nombre].tsx en PascalCase = nombre del directorio (Req 5.1) ---
  const esperado = nombreComponenteEsperado(nombreDirectorio);
  if (nombreComponente !== esperado) {
    hallazgos.push(
      hallazgoCriterio(
        componentePosix,
        "nombre-tsx",
        `El archivo \`${nombreComponente}.tsx\` no coincide en PascalCase con el ` +
          `nombre del directorio \`${nombreDirectorio}\` (se esperaba \`${esperado}.tsx\`).`,
        `Renombrar el archivo a \`${esperado}.tsx\` para que coincida en ` +
          "PascalCase con el nombre del directorio del componente.",
      ),
    );
  }

  // --- Criterio 2: existe [Nombre].types.ts (Req 5.2) ---
  const archivoTypes = `${nombreComponente}.types.ts`;
  if (!nombresEnDirectorio.has(archivoTypes)) {
    hallazgos.push(
      hallazgoCriterio(
        componentePosix,
        "archivo-types",
        `El directorio del componente no contiene \`${archivoTypes}\`.`,
        `Crear \`${directorioPosix}/${archivoTypes}\` con las interfaces y \`type\` ` +
          "de las props y el estado del componente.",
      ),
    );
  }

  // --- Criterio 3: index.ts que exporta el componente (Req 5.3) ---
  if (!nombresEnDirectorio.has(ARCHIVO_BARREL)) {
    hallazgos.push(
      hallazgoCriterio(
        componentePosix,
        "barrel-index",
        `El directorio del componente no contiene un barrel \`${ARCHIVO_BARREL}\`.`,
        `Crear \`${directorioPosix}/${ARCHIVO_BARREL}\` que reexporte el componente ` +
          `(p. ej. \`export { default as ${nombreComponente} } from "./${nombreComponente}";\`).`,
      ),
    );
  } else {
    const rutaBarrel = path.join(directorioAbsoluto, ARCHIVO_BARREL);
    const barrelPosix = aRutaRelativaPosix(raizProyecto, rutaBarrel);
    const contenidoBarrel = await leerArchivoOOmitir(
      rutaBarrel,
      barrelPosix,
      omisiones,
    );
    if (contenidoBarrel !== null && !exportaComponente(contenidoBarrel, nombreComponente)) {
      hallazgos.push(
        hallazgoCriterio(
          componentePosix,
          "barrel-index",
          `El barrel \`${barrelPosix}\` no exporta el componente \`${nombreComponente}\`.`,
          `Añadir al barrel la reexportación del componente ` +
            `(p. ej. \`export { default as ${nombreComponente} } from "./${nombreComponente}";\`).`,
        ),
      );
    }
  }

  // --- Criterio 4: props con `className?: string` opcional (Req 5.4) ---
  // Se busca el soporte de `className` tanto en el archivo de tipos (ubicación
  // canónica) como en el propio `[Nombre].tsx` (declaraciones inline).
  const contenidosProps: string[] = [];
  const rutaComponente = path.join(directorioAbsoluto, archivoComponente);
  const contenidoComponente = await leerArchivoOOmitir(
    rutaComponente,
    componentePosix,
    omisiones,
  );
  if (contenidoComponente !== null) {
    contenidosProps.push(contenidoComponente);
  }
  if (nombresEnDirectorio.has(archivoTypes)) {
    const rutaTypes = path.join(directorioAbsoluto, archivoTypes);
    const typesPosix = aRutaRelativaPosix(raizProyecto, rutaTypes);
    const contenidoTypes = await leerArchivoOOmitir(rutaTypes, typesPosix, omisiones);
    if (contenidoTypes !== null) {
      contenidosProps.push(contenidoTypes);
    }
  }
  const soportaClassName = contenidosProps.some(declaraClassNameOpcional);
  if (!soportaClassName) {
    hallazgos.push(
      hallazgoCriterio(
        componentePosix,
        "prop-classname",
        "Las props del componente no incluyen soporte para una propiedad " +
          "`className?: string` opcional.",
        "Añadir `className?: string` a la interface de props del componente para " +
          "permitir la composición en layouts mayores.",
      ),
    );
  }
}

/**
 * Recorre recursivamente `components/` identificando directorios de componente
 * y acumulando los hallazgos estructurales. Un directorio se considera un
 * componente cuando contiene al menos un archivo `[Nombre].tsx` cuyo nombre base
 * está en PascalCase; cada uno de esos archivos se evalúa como componente. Los
 * subdirectorios se exploran de forma recursiva (p. ej. `components/header/*`).
 */
async function recorrerDirectorio(
  raizProyecto: string,
  directorioAbsoluto: string,
  hallazgos: Hallazgo[],
  omisiones: Omision[],
): Promise<void> {
  const entradas = await leerDirectorioOOmitir(
    raizProyecto,
    directorioAbsoluto,
    omisiones,
  );
  if (entradas === null) {
    return;
  }

  const nombresArchivo = new Set<string>();
  const subdirectorios: string[] = [];
  for (const entrada of entradas) {
    if (entrada.isDirectory()) {
      subdirectorios.push(entrada.name);
    } else if (entrada.isFile()) {
      nombresArchivo.add(entrada.name);
    }
  }

  // Archivos `[Nombre].tsx` en PascalCase: candidatos a componente principal.
  const archivosComponente = [...nombresArchivo]
    .filter(
      (nombre) =>
        nombre.endsWith(".tsx") &&
        esNombrePascalCase(path.basename(nombre, ".tsx")),
    )
    .sort((a, b) => a.localeCompare(b));

  for (const archivoComponente of archivosComponente) {
    await analizarComponente(
      raizProyecto,
      directorioAbsoluto,
      nombresArchivo,
      archivoComponente,
      hallazgos,
      omisiones,
    );
  }

  // Exploración recursiva de subdirectorios (orden estable).
  for (const subdirectorio of subdirectorios.sort((a, b) => a.localeCompare(b))) {
    await recorrerDirectorio(
      raizProyecto,
      path.join(directorioAbsoluto, subdirectorio),
      hallazgos,
      omisiones,
    );
  }
}

/**
 * Ejecuta el chequeo estructural de componentes (Req 5) sobre el directorio
 * `components/` del proyecto y produce los `Hallazgo[]` de la regla
 * `"skill-estandarizacion"` junto con las omisiones encontradas.
 *
 * Por cada directorio de componente (identificado por un `[Nombre].tsx` en
 * PascalCase) se verifican los cuatro criterios de la Estructura_Componente y se
 * emite un hallazgo independiente por cada criterio incumplido (Req 5.5). Los
 * directorios/archivos ilegibles se registran como `Omision` y el recorrido
 * continúa (Req 5.6).
 *
 * @param opciones Raíz del proyecto sobre la que operar.
 * @returns Hallazgos estructurales y omisiones acumuladas.
 */
export async function chequearEstructura(
  opciones: OpcionesChequeoEstructura = {},
): Promise<ResultadoChequeoEstructura> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const hallazgos: Hallazgo[] = [];
  const omisiones: Omision[] = [];

  const directorioComponentes = path.join(raizProyecto, DIRECTORIO_COMPONENTES);
  await recorrerDirectorio(raizProyecto, directorioComponentes, hallazgos, omisiones);

  return { hallazgos, omisiones };
}
