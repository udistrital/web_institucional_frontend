/**
 * Clasificador de inventario del Sistema_Auditoria.
 *
 * A partir del resultado del recorrido de FS (`walk`), construye el inventario
 * del frontend asignando a cada elemento exactamente una categoría. La
 * clasificación aplica un orden estricto (Req 1.5):
 *
 *   1. Si el elemento contiene al menos una operación de solicitud de red hacia
 *      el backend Drupal → `modulo-datos`. Esta regla tiene prioridad AUNQUE el
 *      elemento además componga otros componentes o gestione estado (Req 1.4).
 *   2. En caso contrario, si gestiona estado o compone otros componentes →
 *      `componente-contenedor`.
 *   3. En caso contrario → `componente-presentacional`.
 *
 * La lógica se separa en dos capas para favorecer la testabilidad:
 * - `clasificar(perfil)`: función pura dirigida por booleanos (`hasRed`,
 *   `gestionaEstado`, `componeComponentes`). Es el núcleo verificable por la
 *   propiedad de clasificación (Property 6, tarea 2.3*).
 * - `construirInventario(...)`: capa de orquestación que lee el contenido de
 *   cada archivo (vía `leerTextoOOmitir`), construye su perfil con una
 *   heurística ligera y produce `ItemInventario[]`.
 *
 * La detección de red/estado/composición aquí es una heurística interna y
 * deliberadamente ligera: los detectores dedicados (`detectors/network.ts`,
 * `detectors/jsonapi.ts`) son tareas posteriores (3.x). `construirInventario`
 * acepta un detector de red inyectable para poder sustituir esa heurística por
 * el detector dedicado sin reescribir la clasificación.
 */

import * as path from "node:path";

import type { ItemInventario, Omision } from "./types";
import { leerTextoOOmitir } from "./walk.ts";
import type { ArchivoComponente, ResultadoWalk, RutaPagina } from "./walk";

/**
 * Perfil de un elemento inventariado: los tres rasgos que determinan su
 * categoría. Entrada de la función pura `clasificar`.
 */
export interface PerfilElemento {
  /**
   * `true` si el elemento contiene al menos una operación de solicitud de red
   * hacia el backend Drupal (p. ej. `fetch(`, `XMLHttpRequest`, cliente HTTP).
   */
  hasRed: boolean;
  /** `true` si el elemento gestiona estado (p. ej. `useState`/`useReducer`). */
  gestionaEstado: boolean;
  /** `true` si el elemento compone (renderiza/importa) otros componentes. */
  componeComponentes: boolean;
}

/**
 * Clasifica un elemento en exactamente una categoría aplicando el orden
 * estricto de la Req 1.5. Función pura y total.
 *
 * El orden importa: la red tiene prioridad absoluta, de modo que un elemento
 * con red se clasifica como `modulo-datos` aunque también gestione estado o
 * componga componentes.
 */
export function clasificar(perfil: PerfilElemento): ItemInventario["categoria"] {
  if (perfil.hasRed) {
    return "modulo-datos";
  }
  if (perfil.gestionaEstado || perfil.componeComponentes) {
    return "componente-contenedor";
  }
  return "componente-presentacional";
}

/**
 * Detector de red: dado el contenido de un archivo, decide si contiene al menos
 * una operación de solicitud de red. Se inyecta en `construirInventario` para
 * poder reemplazar la heurística interna por el detector dedicado (tarea 3.1).
 */
export type DetectorRed = (contenido: string) => boolean;

/**
 * Patrones de la heurística ligera de red. Cubre `fetch(`, `XMLHttpRequest`,
 * clientes HTTP comunes y el uso directo del cliente Drupal en el archivo.
 */
const PATRONES_RED: readonly RegExp[] = [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\baxios\b/,
  /from\s+["']axios["']/,
  /from\s+["']next-drupal["']/,
  /\bNextDrupal\b/,
];

/** Patrones de gestión de estado (hooks de estado de React). */
const PATRONES_ESTADO: readonly RegExp[] = [
  /\buseState\s*\(/,
  /\buseReducer\s*\(/,
];

/**
 * Patrón de composición de componentes: un elemento JSX cuyo nombre empieza por
 * mayúscula (`<Algo`), que indica el render de otro componente.
 */
const PATRON_COMPOSICION_JSX = /<[A-Z][A-Za-z0-9]*[\s/>]/;

/**
 * Patrón de importación de un identificador en PascalCase desde una ruta
 * relativa o de alias de componentes, señal de composición por importación.
 */
const PATRON_IMPORT_COMPONENTE =
  /import\s+(?:[A-Z][A-Za-z0-9]*|\{[^}]*\b[A-Z][A-Za-z0-9]*[^}]*\})\s+from\s+["'](?:\.\.?\/|@\/components\/)/;

/** Heurística ligera de red por defecto. */
function detectorRedPorDefecto(contenido: string): boolean {
  return PATRONES_RED.some((patron) => patron.test(contenido));
}

/** Heurística ligera de gestión de estado. */
function detectaEstado(contenido: string): boolean {
  return PATRONES_ESTADO.some((patron) => patron.test(contenido));
}

/** Heurística ligera de composición de componentes. */
function detectaComposicion(contenido: string): boolean {
  return (
    PATRON_COMPOSICION_JSX.test(contenido) ||
    PATRON_IMPORT_COMPONENTE.test(contenido)
  );
}

/**
 * Construye el perfil de un elemento a partir del contenido de su archivo,
 * usando el detector de red proporcionado y las heurísticas internas de estado
 * y composición.
 */
function construirPerfil(contenido: string, detectorRed: DetectorRed): PerfilElemento {
  return {
    hasRed: detectorRed(contenido),
    gestionaEstado: detectaEstado(contenido),
    componeComponentes: detectaComposicion(contenido),
  };
}

/** Opciones de `construirInventario`. */
export interface OpcionesInventario {
  /**
   * Directorio raíz del proyecto frontend. Debe coincidir con el usado por
   * `walk` para que las rutas relativas registradas sean consistentes. Por
   * defecto, el directorio de trabajo actual del proceso.
   */
  raizProyecto?: string;
  /**
   * Detector de red inyectable. Por defecto usa la heurística ligera interna;
   * puede sustituirse por el detector dedicado (`detectors/network.ts`).
   */
  detectorRed?: DetectorRed;
}

/**
 * Resultado de la construcción del inventario: los elementos clasificados y las
 * omisiones acumuladas al leer sus archivos.
 */
export interface ResultadoInventario {
  /** Elementos inventariados y clasificados. */
  items: ItemInventario[];
  /** Archivos omitidos durante la lectura, con su motivo. */
  omisiones: Omision[];
}

/**
 * Construye el inventario clasificado del frontend a partir del resultado del
 * recorrido de FS.
 *
 * Para cada ruta (`page.tsx`) y cada componente, lee el contenido del archivo,
 * construye su perfil y lo clasifica con `clasificar`. Las rutas conservan su
 * `rutaAsociada` (la ruta de aplicación derivada por `walk`). Los archivos que
 * no pueden leerse se registran como omisión y se excluyen del inventario sin
 * interrumpir el proceso (Req 2.5, 5.6).
 */
export async function construirInventario(
  resultadoWalk: ResultadoWalk,
  opciones: OpcionesInventario = {},
): Promise<ResultadoInventario> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const detectorRed = opciones.detectorRed ?? detectorRedPorDefecto;
  const omisiones: Omision[] = [];
  const items: ItemInventario[] = [];

  const clasificarArchivo = async (
    archivo: string,
    rutaAsociada?: string,
  ): Promise<void> => {
    const rutaAbsoluta = path.join(raizProyecto, ...archivo.split("/"));
    const contenido = await leerTextoOOmitir(raizProyecto, rutaAbsoluta, omisiones);
    if (contenido === null) {
      return;
    }
    const categoria = clasificar(construirPerfil(contenido, detectorRed));
    const item: ItemInventario = { archivo, categoria };
    if (rutaAsociada !== undefined) {
      item.rutaAsociada = rutaAsociada;
    }
    items.push(item);
  };

  // Rutas de app/: conservan su ruta de aplicación como `rutaAsociada`.
  for (const ruta of resultadoWalk.rutas as readonly RutaPagina[]) {
    await clasificarArchivo(ruta.archivo, ruta.ruta);
  }

  // Componentes de components/.
  for (const componente of resultadoWalk.componentes as readonly ArchivoComponente[]) {
    await clasificarArchivo(componente.archivo);
  }

  return { items, omisiones };
}
