/**
 * Chequeo de la Capa_Servicios del Sistema_Auditoria (regla 2: Capa de Servicios).
 *
 * Verifica que la interacción de red con el backend Drupal esté aislada en la
 * Capa_Servicios (`services/` o `lib/api/`) y que las funciones de obtención de
 * datos devuelvan Interfaces_Planas en lugar de la estructura JSON:API sin
 * transformar. Produce `Hallazgo[]` bajo la regla `"2-capa-servicios"`.
 *
 * Requisitos cubiertos (Req 3):
 * - 3.1: comprobar la existencia de al menos uno de los directorios de la
 *   Capa_Servicios (`services/` o `lib/api/`) bajo la raíz del proyecto.
 * - 3.2: si no existe ninguno, registrar un hallazgo de severidad alta con la
 *   lista de directorios esperados que no se encontraron.
 * - 3.3: marcar como severidad media cada módulo de datos (`modulo-datos`) que
 *   resida fuera de la Capa_Servicios, con su ruta actual y la ruta destino
 *   recomendada dentro de la capa.
 * - 3.4: marcar como severidad media toda función de obtención de datos que
 *   devuelva la estructura JSON:API sin transformar, indicando su ubicación.
 * - 3.5: si no se puede acceder o leer el directorio raíz del proyecto,
 *   registrar la imposibilidad de completar la verificación preservando los
 *   resultados obtenidos hasta ese momento.
 *
 * Diseño: la función principal (`chequearCapaServicios`) recibe la raíz del
 * proyecto y el inventario ya construido, de modo que es dirigible a árboles de
 * prueba y verificable sin ejecutar la app. La detección de JSON:API sin
 * transformar reutiliza el detector dedicado (`detectors/jsonapi.ts`) y una
 * heurística de retorno de funciones, sin modificar los módulos existentes.
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";

import { detectarJsonApi } from "../detectors/jsonapi.ts";
import type { Hallazgo, ItemInventario, Omision } from "../types";

/** Regla de arquitectura bajo la que se agrupan los hallazgos de este chequeo. */
const REGLA = "2-capa-servicios" as const;

/**
 * Directorios que conforman la Capa_Servicios (Req 3.1). Se expresan en formato
 * POSIX relativo a la raíz del proyecto; el orden define la preferencia de la
 * ruta destino recomendada (se prioriza `services/`, coherente con el diseño).
 */
export const DIRECTORIOS_CAPA_SERVICIOS: readonly string[] = [
  "services",
  "lib/api",
];

/**
 * Resultado del chequeo de la Capa_Servicios. Separa los hallazgos de las
 * omisiones y expone si el chequeo pudo completarse, para que el generador del
 * informe preserve los resultados aunque la raíz sea inaccesible (Req 3.5).
 */
export interface ResultadoChequeoServicios {
  /** Hallazgos detectados bajo la regla `"2-capa-servicios"`. */
  hallazgos: Hallazgo[];
  /** Omisiones registradas durante el chequeo (p. ej. archivos no legibles). */
  omisiones: Omision[];
  /**
   * `true` si el chequeo pudo completarse; `false` si la raíz del proyecto fue
   * inaccesible y la verificación quedó incompleta (Req 3.5). En ese caso, los
   * hallazgos y omisiones acumulados previamente se preservan.
   */
  completado: boolean;
}

/** Opciones del chequeo de la Capa_Servicios. */
export interface OpcionesChequeoServicios {
  /**
   * Directorio raíz del proyecto frontend sobre el que operar. Debe coincidir
   * con el usado por `walk`/`construirInventario` para que las rutas relativas
   * sean consistentes. Por defecto, el directorio de trabajo actual.
   */
  raizProyecto?: string;
  /**
   * Inventario ya construido (`construirInventario`). Los elementos de
   * categoría `modulo-datos` que residan fuera de la Capa_Servicios producen
   * hallazgos de severidad media (Req 3.3). Por defecto, vacío.
   */
  inventario?: readonly ItemInventario[];
}

/**
 * Normaliza una ruta relativa a formato POSIX (separador `/`), para que las
 * comparaciones de pertenencia a la capa sean estables entre sistemas.
 */
function aPosix(ruta: string): string {
  return ruta.split(path.sep).join("/");
}

/**
 * Indica si una ruta de archivo (POSIX, relativa a la raíz) reside dentro de
 * alguno de los directorios de la Capa_Servicios.
 */
function dentroDeCapaServicios(archivoPosix: string): boolean {
  return DIRECTORIOS_CAPA_SERVICIOS.some(
    (dir) => archivoPosix === dir || archivoPosix.startsWith(`${dir}/`),
  );
}

/**
 * Deriva la ruta destino recomendada dentro de la Capa_Servicios para un módulo
 * de datos ubicado fuera de ella (Req 3.3). Conserva el nombre de archivo y lo
 * reubica bajo el primer directorio preferido de la capa (`services/`).
 */
function rutaDestinoRecomendada(archivoPosix: string): string {
  const nombre = archivoPosix.split("/").pop() ?? archivoPosix;
  return `${DIRECTORIOS_CAPA_SERVICIOS[0]}/${nombre}`;
}

/**
 * Comprueba si una ruta de directorio existe y es un directorio accesible.
 * Devuelve `false` ante cualquier error de acceso o si no es un directorio.
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
 * Determina el motivo de omisión/impedimento a partir de un error del sistema
 * de archivos, para describir con precisión por qué no se pudo acceder.
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
      return "el directorio raíz del proyecto no existe";
    }
    if (code === "EACCES" || code === "EPERM") {
      return "el directorio raíz del proyecto no puede leerse (permiso denegado)";
    }
    return `el directorio raíz del proyecto no puede leerse (${code})`;
  }
  if (error instanceof Error) {
    return `el directorio raíz del proyecto no puede leerse (${error.message})`;
  }
  return "el directorio raíz del proyecto no puede leerse";
}

/**
 * Expresión que localiza una sentencia `return` cuyo valor accede a la
 * estructura JSON:API de forma inmediata (p. ej. `return response.data;`,
 * `return json.data.attributes;`, `return payload["included"];`). Se usa para
 * detectar funciones que devuelven JSON:API sin transformar (Req 3.4).
 *
 * La expresión exige que tras `return` aparezca una expresión que contenga un
 * acceso a una de las propiedades JSON:API antes del fin de la sentencia (`;` o
 * fin de línea), evitando coincidir con returns de interfaces planas.
 */
const EXPRESION_RETURN_JSONAPI =
  /\breturn\b[^;\n]*(?:(?:\?\.|\.)\s*(?:data|attributes|relationships|included)(?![\w$])|\[\s*(['"])(?:data|attributes|relationships|included)\1\s*\])/;

/**
 * Comprueba, por líneas, si el contenido de un archivo contiene al menos una
 * sentencia `return` que devuelve directamente la estructura JSON:API sin
 * transformar, y devuelve la línea 1-indexada de la primera ocurrencia o
 * `undefined` si no hay ninguna.
 */
function primeraLineaReturnJsonApi(contenido: string): number | undefined {
  const lineas = contenido.split(/\r\n|\r|\n/);
  for (let indice = 0; indice < lineas.length; indice += 1) {
    if (EXPRESION_RETURN_JSONAPI.test(lineas[indice])) {
      return indice + 1;
    }
  }
  return undefined;
}

/**
 * Lee el contenido textual de un archivo. Si no puede leerse, registra una
 * `Omision` y devuelve `null` para que el chequeo continúe (Req 3.5 en lo que
 * respecta a archivos concretos; la raíz inaccesible se trata aparte).
 */
async function leerContenidoOOmitir(
  rutaAbsoluta: string,
  archivoPosix: string,
  omisiones: Omision[],
): Promise<string | null> {
  try {
    const contenido = await fs.readFile(rutaAbsoluta, "utf8");
    if (contenido.includes("\uFFFD")) {
      omisiones.push({ archivo: archivoPosix, motivo: "el archivo no es texto válido" });
      return null;
    }
    return contenido;
  } catch (error: unknown) {
    omisiones.push({ archivo: archivoPosix, motivo: motivoDesdeError(error) });
    return null;
  }
}

/**
 * Construye el hallazgo de ausencia total de la Capa_Servicios (Req 3.2):
 * severidad alta e inclusión de la lista de directorios esperados.
 */
function hallazgoAusenciaCapa(): Hallazgo {
  const esperados = DIRECTORIOS_CAPA_SERVICIOS.map((dir) => `${dir}/`).join(" ni ");
  return {
    regla: REGLA,
    archivo: ".",
    severidad: "alta",
    descripcion:
      `No existe ninguno de los directorios de la Capa_Servicios (${esperados}) ` +
      "bajo la raíz del proyecto; la interacción de red no está centralizada.",
    remediacion:
      `Crear la Capa_Servicios en uno de los directorios esperados ` +
      `(${DIRECTORIOS_CAPA_SERVICIOS.map((dir) => `${dir}/`).join(" o ")}) y ` +
      "trasladar allí toda la obtención de datos del backend Drupal.",
  };
}

/**
 * Construye el hallazgo de módulo de datos ubicado fuera de la Capa_Servicios
 * (Req 3.3): severidad media, con ruta actual y ruta destino recomendada.
 */
function hallazgoModuloFueraDeCapa(archivoPosix: string): Hallazgo {
  const destino = rutaDestinoRecomendada(archivoPosix);
  return {
    regla: REGLA,
    archivo: archivoPosix,
    severidad: "media",
    descripcion:
      `El módulo de datos \`${archivoPosix}\` realiza obtención de datos pero ` +
      "reside fuera de la Capa_Servicios.",
    remediacion: `Reubicar el módulo dentro de la Capa_Servicios en \`${destino}\`.`,
  };
}

/**
 * Construye el hallazgo de función que devuelve JSON:API sin transformar
 * (Req 3.4): severidad media, con la ubicación (archivo y línea) de la función.
 */
function hallazgoReturnJsonApi(archivoPosix: string, linea: number): Hallazgo {
  return {
    regla: REGLA,
    archivo: archivoPosix,
    linea,
    severidad: "media",
    descripcion:
      `La función en \`${archivoPosix}\` devuelve la estructura JSON:API sin ` +
      "transformar (acceso directo a data/attributes/relationships/included en un return).",
    remediacion:
      "Transformar la respuesta JSON:API en una Interface_Plana antes de devolverla " +
      "al componente, siguiendo el patrón de mappers de la Capa_Servicios.",
  };
}

/**
 * Ejecuta el chequeo de la Capa_Servicios sobre la raíz del proyecto y el
 * inventario proporcionado, produciendo los hallazgos de la regla
 * `"2-capa-servicios"`.
 *
 * Orden del chequeo:
 *   1. Confirmar que la raíz del proyecto es accesible. Si no lo es, registrar
 *      la imposibilidad de completar la verificación y devolver el resultado
 *      preservando lo acumulado (`completado: false`, Req 3.5).
 *   2. Verificar la existencia de los directorios de la Capa_Servicios; si
 *      ninguno existe, emitir el hallazgo de severidad alta (Req 3.1, 3.2).
 *   3. Marcar los módulos de datos del inventario que residen fuera de la capa
 *      (severidad media, con ruta destino recomendada) (Req 3.3).
 *   4. Dentro de la capa (o entre los módulos de datos presentes), marcar las
 *      funciones que devuelven JSON:API sin transformar (severidad media)
 *      (Req 3.4).
 *
 * @param opciones Raíz del proyecto e inventario de entrada.
 * @returns Hallazgos, omisiones y la señal de si el chequeo se completó.
 */
export async function chequearCapaServicios(
  opciones: OpcionesChequeoServicios = {},
): Promise<ResultadoChequeoServicios> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const inventario = opciones.inventario ?? [];
  const hallazgos: Hallazgo[] = [];
  const omisiones: Omision[] = [];

  // --- Paso 1: raíz del proyecto accesible (Req 3.5) ---
  const raizAccesible = await esDirectorioAccesible(raizProyecto);
  if (!raizAccesible) {
    omisiones.push({
      archivo: ".",
      motivo:
        "no se pudo acceder o leer el directorio raíz del proyecto; la " +
        "verificación de la Capa_Servicios no pudo completarse",
    });
    return { hallazgos, omisiones, completado: false };
  }

  // --- Paso 2: existencia de la Capa_Servicios (Req 3.1, 3.2) ---
  const existencias = await Promise.all(
    DIRECTORIOS_CAPA_SERVICIOS.map((dir) =>
      esDirectorioAccesible(path.join(raizProyecto, ...dir.split("/"))),
    ),
  );
  const existeAlgunaCapa = existencias.some(Boolean);
  if (!existeAlgunaCapa) {
    hallazgos.push(hallazgoAusenciaCapa());
  }

  // --- Paso 3: módulos de datos fuera de la Capa_Servicios (Req 3.3) ---
  const modulosDatosFuera: string[] = [];
  for (const item of inventario) {
    if (item.categoria !== "modulo-datos") {
      continue;
    }
    const archivoPosix = aPosix(item.archivo);
    if (!dentroDeCapaServicios(archivoPosix)) {
      hallazgos.push(hallazgoModuloFueraDeCapa(archivoPosix));
      modulosDatosFuera.push(archivoPosix);
    }
  }

  // --- Paso 4: funciones que devuelven JSON:API sin transformar (Req 3.4) ---
  // Se analizan los módulos de datos del inventario (dentro y fuera de la capa):
  // son los candidatos a contener funciones de obtención de datos.
  const archivosAInspeccionar = new Set<string>();
  for (const item of inventario) {
    if (item.categoria === "modulo-datos") {
      archivosAInspeccionar.add(aPosix(item.archivo));
    }
  }

  for (const archivoPosix of archivosAInspeccionar) {
    const rutaAbsoluta = path.join(raizProyecto, ...archivoPosix.split("/"));
    const contenido = await leerContenidoOOmitir(rutaAbsoluta, archivoPosix, omisiones);
    if (contenido === null) {
      continue;
    }
    const linea = primeraLineaReturnJsonApi(contenido);
    if (linea !== undefined) {
      // Confirmación cruzada con el detector dedicado: solo se marca si el
      // archivo realmente contiene acceso a la estructura JSON:API.
      const ocurrencias = detectarJsonApi(contenido, archivoPosix);
      if (ocurrencias.length > 0) {
        hallazgos.push(hallazgoReturnJsonApi(archivoPosix, linea));
      }
    }
  }

  return { hallazgos, omisiones, completado: true };
}
