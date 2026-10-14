/**
 * Detector de referencias a Artefactos_Eliminados del Componente_Ejemplo_Article
 * (Feature: global-standardization-and-cleanup, Property 3).
 *
 * Tras la Fase 1 (eliminación segura del Componente_Ejemplo_Article) el árbol
 * fuente activo NO debe contener ninguna referencia a los artefactos borrados:
 *
 * - `components/article` (componente de ejemplo)
 * - `services/articles` (servicio de ejemplo)
 * - `services/articles.types` (tipos del servicio de ejemplo)
 * - `app/[...slug]` (ruta catch-all consumidora del ejemplo)
 *
 * Diseño: el detector es una **función pura** sobre texto. No lee del sistema de
 * archivos; recibe el contenido y la ruta del archivo y devuelve una ocurrencia
 * por cada coincidencia, con el número de línea 1-indexado de donde aparece.
 *
 * Matching dirigido a especificadores de importación / rutas de módulo para
 * evitar falsos positivos (Req 2.4). En concreto, NO deben coincidir:
 * - La etiqueta HTML semántica `<article>`.
 * - El tipo de contenido Drupal `node/article` (cadena de JSON:API en
 *   `app/sitemap.ts`).
 * - Ejemplos en comentarios que no son especificadores de importación reales.
 *
 * Para ello cada patrón ancla la coincidencia a un contexto de importación
 * (import/export/`require`/`import()`), ya sea con alias de proyecto (`@/...`) o
 * con ruta relativa (`./`, `../`), o a un segmento de ruta de archivo de
 * sistema (`/`), de modo que subcadenas sueltas no disparen el detector.
 *
 * Requisitos cubiertos: 2.4.
 */

/**
 * Clase de artefacto eliminado al que apunta una referencia detectada.
 */
export type ClaseArtefactoEliminado =
  | "components/article"
  | "services/articles"
  | "services/articles.types"
  | "app/[...slug]";

/**
 * Una referencia a un artefacto eliminado detectada en un archivo, con su
 * ubicación exacta (archivo + línea 1-indexada) y la clase de artefacto.
 */
export interface OcurrenciaArtefactoEliminado {
  /** Ruta del archivo donde se detectó, relativa a la raíz del proyecto. */
  archivo: string;
  /** Número de línea de la ocurrencia (1-indexado). */
  linea: number;
  /** Artefacto eliminado al que apunta la referencia. */
  clase: ClaseArtefactoEliminado;
  /** Texto exacto de la coincidencia, para diagnóstico. */
  coincidencia: string;
}

/**
 * Patrón de detección: una expresión regular global asociada a su clase.
 */
interface PatronArtefacto {
  /** Clase de artefacto eliminado que produce el patrón. */
  clase: ClaseArtefactoEliminado;
  /** Expresión regular global que localiza la referencia en una línea. */
  expresion: RegExp;
}

/**
 * Prefijo que ancla una coincidencia a un especificador de módulo. Reconoce:
 * - Alias de proyecto: `@/<ruta>` (equivalente a la raíz, según `tsconfig`).
 * - Ruta relativa: uno o más `./` o `../`.
 * - Segmento de ruta de archivo del sistema: una `/` previa (p. ej. rutas en
 *   `app/[...slug]/...`).
 *
 * El prefijo se exige SIEMPRE antes del nombre del artefacto, de modo que una
 * subcadena suelta (p. ej. la palabra `article` en `node/article` o un
 * `<article>`) no coincida salvo que forme parte de un especificador de módulo
 * real a los artefactos eliminados.
 */
const PREFIJO_MODULO = String.raw`(?:@\/|(?:\.\.?\/)+)`;

/**
 * Patrones de artefactos eliminados evaluados por el detector. El orden más
 * específico (`services/articles.types`) precede al más general
 * (`services/articles`) para clasificar correctamente la clase cuando ambos
 * podrían aplicar; el detector evita el doble conteo deduplicando por posición.
 */
const PATRONES_ARTEFACTO: readonly PatronArtefacto[] = [
  // `@/services/articles.types`, `../services/articles.types`, con `.ts(x)` opcional.
  {
    clase: "services/articles.types",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}services\/articles\.types(?:\.tsx?)?`,
      "g",
    ),
  },
  // `@/services/articles`, `../services/articles` (y `articles/...`), con
  // extensión opcional. No coincide con `services/articles.types` porque ese
  // caso lo captura el patrón anterior y se deduplica por posición.
  {
    clase: "services/articles",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}services\/articles(?:\.tsx?|\/[\w.-]+)?`,
      "g",
    ),
  },
  // `@/components/article`, `../components/article` (y `article/...`).
  {
    clase: "components/article",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}components\/article(?:\.tsx?|\/[\w.-]+)?`,
      "g",
    ),
  },
  // Ruta catch-all `app/[...slug]`: ya sea como especificador de módulo con
  // prefijo o como segmento de ruta del sistema (precedido por `/`).
  {
    clase: "app/[...slug]",
    expresion: new RegExp(
      String.raw`(?:${PREFIJO_MODULO}|\/)app\/\[\.\.\.slug\]`,
      "g",
    ),
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
 * Rango [inicio, fin) ocupado por una coincidencia ya registrada en una línea,
 * usado para deduplicar solapamientos entre patrones (p. ej.
 * `services/articles.types` vs `services/articles`).
 */
interface RangoCoincidencia {
  inicio: number;
  fin: number;
}

/**
 * Indica si un rango se solapa con alguno de los rangos ya registrados.
 */
function seSolapa(
  inicio: number,
  fin: number,
  registrados: readonly RangoCoincidencia[],
): boolean {
  return registrados.some(
    (rango) => inicio < rango.fin && rango.inicio < fin,
  );
}

/**
 * Detecta las referencias a Artefactos_Eliminados en el contenido de un archivo.
 *
 * Función pura: no accede al sistema de archivos. Recorre el contenido línea a
 * línea y, por cada patrón de {@link PATRONES_ARTEFACTO}, emite una ocurrencia
 * por cada coincidencia encontrada, registrando la línea 1-indexada. Las
 * coincidencias que se solapan en una misma línea se registran una sola vez con
 * la clase del patrón más específico (orden de evaluación), evitando el doble
 * conteo de `services/articles.types` como `services/articles`.
 *
 * Devuelve un arreglo vacío cuando no hay ninguna referencia.
 *
 * @param contenido Contenido textual del archivo a analizar.
 * @param archivo Ruta del archivo (relativa a la raíz del proyecto) con la que
 *   se etiqueta cada ocurrencia.
 * @returns Ocurrencias detectadas, ordenadas por línea y, dentro de una línea,
 *   por posición de inicio.
 */
export function detectarArtefactosEliminados(
  contenido: string,
  archivo: string,
): OcurrenciaArtefactoEliminado[] {
  const ocurrencias: OcurrenciaArtefactoEliminado[] = [];
  const lineas = dividirEnLineas(contenido);

  lineas.forEach((linea, indice) => {
    const numeroLinea = indice + 1;
    const registrados: RangoCoincidencia[] = [];
    const enLinea: OcurrenciaArtefactoEliminado[] = [];

    for (const patron of PATRONES_ARTEFACTO) {
      const expresion = new RegExp(
        patron.expresion.source,
        patron.expresion.flags.includes("g")
          ? patron.expresion.flags
          : `${patron.expresion.flags}g`,
      );
      for (const coincidencia of linea.matchAll(expresion)) {
        const inicio = coincidencia.index ?? 0;
        const fin = inicio + coincidencia[0].length;
        // Deduplica solapamientos: el patrón más específico ya cubrió el rango.
        if (seSolapa(inicio, fin, registrados)) {
          continue;
        }
        registrados.push({ inicio, fin });
        enLinea.push({
          archivo,
          linea: numeroLinea,
          clase: patron.clase,
          coincidencia: coincidencia[0],
        });
      }
    }

    // Orden estable dentro de la línea: por posición de inicio.
    enLinea.sort((a, b) => a.coincidencia.localeCompare(b.coincidencia));
    ocurrencias.push(...enLinea);
  });

  return ocurrencias;
}

/**
 * Indica si el contenido de un archivo contiene al menos una referencia a un
 * artefacto eliminado. Detector booleano de conveniencia.
 */
export function contieneArtefactoEliminado(contenido: string): boolean {
  return detectarArtefactosEliminados(contenido, "").length > 0;
}
