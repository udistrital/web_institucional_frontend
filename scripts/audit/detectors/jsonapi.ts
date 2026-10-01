/**
 * Detector de referencias a la estructura JSON:API del Sistema_Auditoria.
 *
 * Detecta, mediante análisis estático de texto (Req 2.2), el acceso a cualquiera
 * de las propiedades de la estructura anidada de JSON:API —`data`,
 * `attributes`, `relationships` e `included`— tratándolas como acceso a
 * propiedad (p. ej. `response.data`, `recurso?.attributes`,
 * `include["included"]`). Por cada coincidencia se registra el archivo y el
 * número de línea (1-indexado).
 *
 * El enfoque es deliberadamente basado en regex sobre el contenido del archivo
 * (coherente con el diseño): no distingue cadenas ni comentarios, lo que es
 * aceptable; sin embargo, se exige una forma de acceso a propiedad para evitar
 * falsos positivos obvios con identificadores que simplemente contengan esas
 * palabras (p. ej. `metadata`, `relatedData`).
 *
 * La función `detectarJsonApi` es pura y testeable: recibe el contenido del
 * archivo y su ruta, y devuelve la lista de ocurrencias. La tarea 3.4 consume
 * estas ocurrencias para construir el `Hallazgo` y asignar la severidad de la
 * regla de separación de responsabilidades; aquí solo se detecta con líneas
 * correctas.
 */

/**
 * Propiedades de la estructura JSON:API consideradas como coincidencia (Req 2.2).
 */
export const PROPIEDADES_JSONAPI: readonly string[] = [
  "data",
  "attributes",
  "relationships",
  "included",
];

/**
 * Ocurrencia de acceso a la estructura JSON:API detectada en un archivo.
 */
export interface OcurrenciaJsonApi {
  /** Ruta del archivo donde se detectó la ocurrencia. */
  archivo: string;
  /** Número de línea de la ocurrencia (1-indexado). */
  linea: number;
}

/**
 * Expresión regular que reconoce el acceso a una de las propiedades JSON:API
 * como propiedad, en dos formas:
 *
 * - Acceso con punto u encadenamiento opcional: `.data`, `?.attributes`,
 *   admitiendo espacios en blanco tras el punto.
 * - Acceso por índice con literal de cadena: `["included"]`, `['relationships']`.
 *
 * En el acceso con punto se exige que tras la palabra no continúe un carácter de
 * identificador (`\w`) ni `$`, de modo que `.data` coincide pero `.database` no.
 *
 * La bandera global permite recorrer todas las ocurrencias de una misma línea.
 */
const EXPRESION_JSONAPI =
  /(?:\?\.|\.)\s*(?:data|attributes|relationships|included)(?![\w$])|\[\s*(['"])(?:data|attributes|relationships|included)\1\s*\]/g;

/**
 * Detecta todas las ocurrencias de acceso a la estructura JSON:API (`data`,
 * `attributes`, `relationships`, `included`) en el contenido de un archivo.
 *
 * Recorre el contenido línea a línea y, por cada línea, cuenta todas las
 * coincidencias (puede haber varias en una misma línea). El número de línea es
 * 1-indexado. Si no hay ninguna coincidencia, devuelve una lista vacía.
 *
 * @param contenido Contenido textual del archivo a analizar.
 * @param archivo Ruta del archivo analizado, usada en cada ocurrencia.
 * @returns Lista de ocurrencias detectadas, en orden de aparición.
 */
export function detectarJsonApi(
  contenido: string,
  archivo: string,
): OcurrenciaJsonApi[] {
  const ocurrencias: OcurrenciaJsonApi[] = [];
  const lineas = contenido.split("\n");

  for (let indice = 0; indice < lineas.length; indice += 1) {
    const linea = lineas[indice];
    // `lastIndex` se reinicia creando un patrón nuevo por línea para evitar
    // compartir estado entre líneas con la bandera global.
    const patron = new RegExp(EXPRESION_JSONAPI.source, "g");
    while (patron.exec(linea) !== null) {
      ocurrencias.push({ archivo, linea: indice + 1 });
    }
  }

  return ocurrencias;
}
