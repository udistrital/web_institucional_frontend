/**
 * Detector de red del Sistema_Auditoria (regla 1: Separación de Responsabilidades).
 *
 * Dado el contenido de un archivo de texto, localiza las ocurrencias de
 * operaciones de solicitud de red y de importaciones de clientes HTTP, que un
 * componente visual NUNCA debería realizar directamente (Req 2.1):
 *
 * - `fetch(` — API de red del navegador/servidor (`\bfetch\s*\(`).
 * - `XMLHttpRequest` — cliente HTTP de bajo nivel.
 * - Importaciones de clientes HTTP: `axios` y el uso directo del cliente Drupal
 *   `next-drupal` dentro de componentes visuales.
 *
 * Diseño: el detector es una **función pura** sobre texto. No lee del sistema de
 * archivos; recibe el contenido y la ruta del archivo y devuelve una ocurrencia
 * por cada coincidencia, con el número de línea 1-indexado de donde aparece.
 * Esto lo hace testeable por propiedad (Property 4, tarea 3.2*): para N
 * ocurrencias reporta exactamente N hallazgos con la línea correcta, y 0 cuando
 * no hay ninguna. El evaluador de severidad (tarea 3.4) y el generador de
 * informe consumen estas ocurrencias.
 *
 * Requisitos cubiertos: 2.1.
 */

/**
 * Clase de ocurrencia de red detectada. Permite al evaluador de severidad y al
 * informe describir con precisión qué se encontró en cada línea.
 */
export type ClaseOcurrenciaRed =
  | "fetch"
  | "xml-http-request"
  | "import-axios"
  | "import-next-drupal";

/**
 * Una ocurrencia de operación/importación de red detectada en un archivo, con
 * su ubicación exacta (archivo + línea 1-indexada) y la clase de patrón.
 */
export interface OcurrenciaRed {
  /** Ruta del archivo donde se detectó, relativa a la raíz del proyecto. */
  archivo: string;
  /** Número de línea de la ocurrencia (1-indexado). */
  linea: number;
  /** Clase de patrón de red detectado. */
  clase: ClaseOcurrenciaRed;
}

/**
 * Patrón de detección: una expresión regular global asociada a su clase. Las
 * expresiones se marcan con la bandera `g` para poder contar todas las
 * coincidencias dentro de una misma línea (puede haber más de una).
 */
interface PatronRed {
  /** Clase de ocurrencia que produce el patrón. */
  clase: ClaseOcurrenciaRed;
  /** Expresión regular global que localiza el patrón en una línea de texto. */
  expresion: RegExp;
}

/**
 * Patrones de red evaluados por el detector. El orden determina el orden
 * relativo de las ocurrencias detectadas dentro de una misma línea.
 */
const PATRONES_RED: readonly PatronRed[] = [
  // Llamada directa a `fetch(` (admite espacios entre el nombre y el paréntesis).
  { clase: "fetch", expresion: /\bfetch\s*\(/g },
  // Uso del cliente HTTP de bajo nivel `XMLHttpRequest`.
  { clase: "xml-http-request", expresion: /\bXMLHttpRequest\b/g },
  // Importación del cliente HTTP `axios` (`import ... from "axios"`,
  // `require("axios")`).
  {
    clase: "import-axios",
    expresion: /\b(?:from|require\s*\(\s*)["']axios["']/g,
  },
  // Importación directa del cliente Drupal `next-drupal` en componentes visuales.
  {
    clase: "import-next-drupal",
    expresion: /\b(?:from|require\s*\(\s*)["']next-drupal["']/g,
  },
];

/**
 * Divide el contenido de un archivo en líneas conservando la correspondencia
 * 1-indexada con el documento original. Admite finales de línea `\n`, `\r\n` y
 * `\r` para que el número de línea reportado coincida con el del editor.
 */
function dividirEnLineas(contenido: string): string[] {
  return contenido.split(/\r\n|\r|\n/);
}

/**
 * Cuenta las coincidencias de una expresión regular global dentro de una línea.
 * Se usa `matchAll` sobre una copia con bandera `g` para no depender del estado
 * mutable de `lastIndex` del patrón compartido.
 */
function contarCoincidencias(expresion: RegExp, linea: string): number {
  const expresionGlobal = new RegExp(
    expresion.source,
    expresion.flags.includes("g") ? expresion.flags : `${expresion.flags}g`,
  );
  return [...linea.matchAll(expresionGlobal)].length;
}

/**
 * Detecta las ocurrencias de operaciones de red y de importaciones de clientes
 * HTTP en el contenido de un archivo.
 *
 * Función pura: no accede al sistema de archivos. Recorre el contenido línea a
 * línea y, por cada patrón de {@link PATRONES_RED}, emite una ocurrencia por
 * cada coincidencia encontrada (puede haber varias en la misma línea),
 * registrando la línea 1-indexada. Devuelve un arreglo vacío cuando no hay
 * ninguna ocurrencia.
 *
 * @param contenido Contenido textual del archivo a analizar.
 * @param archivo Ruta del archivo (relativa a la raíz del proyecto) con la que
 *   se etiqueta cada ocurrencia.
 * @returns Ocurrencias detectadas, ordenadas por línea y, dentro de una línea,
 *   por el orden de los patrones.
 */
export function detectarRed(contenido: string, archivo: string): OcurrenciaRed[] {
  const ocurrencias: OcurrenciaRed[] = [];
  const lineas = dividirEnLineas(contenido);

  lineas.forEach((linea, indice) => {
    const numeroLinea = indice + 1;
    for (const patron of PATRONES_RED) {
      const repeticiones = contarCoincidencias(patron.expresion, linea);
      for (let i = 0; i < repeticiones; i += 1) {
        ocurrencias.push({ archivo, linea: numeroLinea, clase: patron.clase });
      }
    }
  });

  return ocurrencias;
}

/**
 * Indica si el contenido de un archivo contiene al menos una operación de red o
 * importación de cliente HTTP. Útil como detector booleano inyectable para el
 * clasificador de inventario (`DetectorRed` de `inventory.ts`).
 */
export function contieneRed(contenido: string): boolean {
  return PATRONES_RED.some((patron) => {
    const expresion = new RegExp(patron.expresion.source);
    return expresion.test(contenido);
  });
}
