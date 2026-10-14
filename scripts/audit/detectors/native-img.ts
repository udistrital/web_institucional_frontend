/**
 * Detector de etiquetas `<img>` nativas en JSX
 * (Feature: global-standardization-and-cleanup, Property 4).
 *
 * Tras la Fase 4 (migración de `<img>` a `next/image`) ningún archivo `.tsx`
 * activo debe contener etiquetas de imagen nativas. Este detector localiza la
 * apertura del elemento JSX `<img>` para poder reportar su ubicación exacta.
 *
 * Diseño: el detector es una **función pura** sobre texto. No lee del sistema de
 * archivos; recibe el contenido y la ruta del archivo y devuelve una ocurrencia
 * por cada etiqueta `<img>` encontrada, con el número de línea 1-indexado.
 *
 * Matching anclado a la apertura real de un elemento JSX para evitar falsos
 * positivos. En concreto, el patrón:
 * - Coincide con `<img ` / `<img/>` / `<img>` (atributos, autocierre o cierre
 *   inmediato).
 * - NO coincide con el componente `<Image>` de `next/image` (mayúscula inicial
 *   distingue por sensibilidad a mayúsculas).
 * - NO coincide con componentes cuyo nombre empieza por `img` seguido de más
 *   caracteres de identificador (p. ej. `<imgX`, `<imageWidget`): tras `img`
 *   solo se admite un delimitador de etiqueta (espacio, `/`, `>` o fin de
 *   línea), nunca otro carácter de identificador.
 * - NO coincide con la palabra `image`/`img` en cadenas o comentarios, porque
 *   requiere el `<` de apertura de etiqueta inmediatamente antes.
 *
 * Requisitos cubiertos: 8.1, 8.4.
 */

/**
 * Una etiqueta `<img>` nativa detectada en un archivo, con su ubicación exacta
 * (archivo + línea 1-indexada) y el texto de la coincidencia para diagnóstico.
 */
export interface OcurrenciaImgNativa {
  /** Ruta del archivo donde se detectó, relativa a la raíz del proyecto. */
  archivo: string;
  /** Número de línea de la ocurrencia (1-indexado). */
  linea: number;
  /** Texto exacto de la coincidencia (p. ej. `<img `), para diagnóstico. */
  coincidencia: string;
}

/**
 * Expresión regular que localiza la apertura de un elemento JSX `<img>`.
 *
 * - `<img` ancla la apertura de etiqueta por el nombre exacto `img`.
 * - `(?=[\s/>]|$)` exige que a continuación venga un delimitador de etiqueta
 *   (espacio en blanco, `/`, `>`) o el fin de línea, de modo que `<Image` y
 *   `<imgX` no coincidan. Es sensible a mayúsculas (sin flag `i`), así que
 *   `<IMG`/`<Img` tampoco disparan: en JSX el elemento HTML nativo es `<img`.
 *
 * El lookahead mantiene la coincidencia acotada al propio `<img`, sin consumir
 * el delimitador, para que el texto reportado sea estable.
 */
const PATRON_IMG_NATIVA = /<img(?=[\s/>]|$)/g;

/**
 * Divide el contenido de un archivo en líneas conservando la correspondencia
 * 1-indexada con el documento original. Admite finales de línea `\n`, `\r\n` y
 * `\r` para que el número de línea reportado coincida con el del editor.
 */
function dividirEnLineas(contenido: string): string[] {
  return contenido.split(/\r\n|\r|\n/);
}

/**
 * Detecta las etiquetas `<img>` nativas en el contenido de un archivo.
 *
 * Función pura: no accede al sistema de archivos. Recorre el contenido línea a
 * línea y emite una ocurrencia por cada apertura de elemento JSX `<img>`,
 * registrando la línea 1-indexada. Devuelve un arreglo vacío cuando no hay
 * ninguna etiqueta nativa.
 *
 * @param contenido Contenido textual del archivo a analizar.
 * @param archivo Ruta del archivo (relativa a la raíz del proyecto) con la que
 *   se etiqueta cada ocurrencia.
 * @returns Ocurrencias detectadas, ordenadas por línea y, dentro de una línea,
 *   por posición de aparición.
 */
export function detectarImgNativas(
  contenido: string,
  archivo: string,
): OcurrenciaImgNativa[] {
  const ocurrencias: OcurrenciaImgNativa[] = [];
  const lineas = dividirEnLineas(contenido);

  lineas.forEach((linea, indice) => {
    const numeroLinea = indice + 1;
    for (const coincidencia of linea.matchAll(PATRON_IMG_NATIVA)) {
      ocurrencias.push({
        archivo,
        linea: numeroLinea,
        coincidencia: coincidencia[0],
      });
    }
  });

  return ocurrencias;
}

/**
 * Indica si el contenido de un archivo contiene al menos una etiqueta `<img>`
 * nativa. Detector booleano de conveniencia.
 */
export function contieneImgNativa(contenido: string): boolean {
  return detectarImgNativas(contenido, "").length > 0;
}
