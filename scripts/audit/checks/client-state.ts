/**
 * Chequeo de estados de carga y error del Sistema_Auditoria (regla
 * `"estados-carga-error"`, Req 6).
 *
 * Analiza los archivos marcados con la directiva `'use client'` y determina si
 * el componente obtiene datos de forma asíncrona en el cliente (una promesa
 * iniciada dentro del componente o de sus hooks cuyo resultado se refleja en el
 * estado renderizado, Req 6.1). Para los componentes cliente con datos
 * asíncronos, verifica la presencia de:
 *
 * - **Estado_Carga** (Req 6.2): representación visible mientras la operación
 *   asíncrona está pendiente (indicador de carga, texto de espera o contenido
 *   de marcador de posición).
 * - **Estado_Error** (Req 6.3): representación visible cuando la operación
 *   falla (mensaje de error, ruta de reintento o contenido alternativo
 *   condicionado al fallo).
 *
 * Por cada estado ausente se registra un `Hallazgo` que identifica el
 * componente y su ubicación de archivo, indicando el tipo de estado ausente
 * (carga o error, Req 6.5). Los componentes cliente SIN datos asíncronos se
 * excluyen de la evaluación y no producen hallazgos (Req 6.4).
 *
 * Diseño orientado a testabilidad (coherente con `checks/typing.ts` y
 * `checks/services-layer.ts`): la detección textual se expresa como funciones
 * **puras** (`esComponenteCliente`, `obtieneDatosAsincronosEnCliente`,
 * `tieneEstadoCarga`, `tieneEstadoError`, `analizarEstadosCliente`) que reciben
 * contenido + ruta y no tocan el sistema de archivos. La orquestación
 * (`chequearEstadosCliente`) lee cada archivo vía `leerTextoOOmitir`
 * (reutilizando el manejo de omisiones del walker) y agrega los hallazgos.
 *
 * El análisis es estático y basado en texto (regex), coherente con el resto de
 * detectores: no distingue cadenas ni comentarios, lo que es aceptable para una
 * auditoría orientada a señalar candidatos a revisión.
 *
 * Requisitos cubiertos: 6.1, 6.2, 6.3, 6.4, 6.5.
 */

import * as path from "node:path";

import type { Hallazgo, Omision, ReglaArquitectura } from "../types";
import { leerTextoOOmitir } from "../walk.ts";

/** Regla de arquitectura bajo la que se agrupan los hallazgos de este chequeo. */
const REGLA: ReglaArquitectura = "estados-carga-error";

/** Tipo de estado de UI evaluado para un componente cliente con datos asíncronos. */
export type TipoEstado = "carga" | "error";

/**
 * Divide el contenido de un archivo en líneas conservando la correspondencia
 * 1-indexada con el documento original. Admite finales de línea `\n`, `\r\n` y
 * `\r` para que el número de línea reportado coincida con el del editor.
 */
function dividirEnLineas(contenido: string): string[] {
  return contenido.split(/\r\n|\r|\n/);
}

/**
 * Expresión que reconoce la directiva `'use client'` (comillas simples o
 * dobles, con punto y coma opcional). En el App Router de Next.js la directiva
 * debe aparecer al inicio del archivo; para tolerar comentarios o líneas en
 * blanco previas, se exige que la línea completa sea la directiva.
 */
const EXPRESION_USE_CLIENT = /^\s*["']use client["']\s*;?\s*$/;

/**
 * Indica si un archivo está marcado con la directiva `'use client'` (Req 6.1).
 * Función pura. Busca la directiva como línea aislada en cualquier punto del
 * encabezado del archivo (tolerando comentarios/espacios previos).
 */
export function esComponenteCliente(contenido: string): boolean {
  return dividirEnLineas(contenido).some((linea) =>
    EXPRESION_USE_CLIENT.test(linea),
  );
}

/**
 * Patrones que señalan una operación asíncrona iniciada dentro del componente o
 * de sus hooks: una promesa cuyo resultado puede llegar al estado renderizado.
 *
 * - `await fetch(` / `await ` sobre una llamada: espera de una promesa.
 * - `.then(` / `.catch(` / `.finally(`: consumo de una promesa.
 * - `fetch(`: inicio de una petición de red (API de promesa).
 * - `useSWR(` / `useQuery(` / `useEffect(` combinados con los anteriores: hooks
 *   de obtención de datos de cliente. `useEffect` por sí solo no implica datos
 *   asíncronos, por lo que se trata como refuerzo, no como señal única.
 */
const EXPRESION_AWAIT = /\bawait\s+[\w$.]+\s*\(/;
const EXPRESION_FETCH = /\bfetch\s*\(/;
const EXPRESION_THEN_CHAIN = /\.\s*(?:then|catch|finally)\s*\(/;
const EXPRESION_HOOK_DATOS = /\b(?:useSWR|useQuery)\s*\(/;

/**
 * Patrones que señalan que el resultado asíncrono se refleja en el estado
 * renderizado: un setter de estado (`setAlgo(`) o el uso de hooks de datos que
 * exponen su resultado directamente (`useSWR`/`useQuery`).
 */
const EXPRESION_SETTER_ESTADO = /\bset[A-Z][A-Za-z0-9]*\s*\(/;
const EXPRESION_USE_STATE = /\buseState\s*(?:<[^>]*>)?\s*\(/;

/**
 * Determina si un componente cliente obtiene datos de forma asíncrona en el
 * cliente cuyo resultado se refleja en el estado renderizado (Req 6.1).
 * Función pura.
 *
 * Criterio: existe (a) una operación asíncrona iniciada en el archivo
 * (`fetch(`, `await …(`, cadena `.then/.catch/.finally`, o un hook de datos
 * `useSWR`/`useQuery`) Y (b) una vía por la que su resultado alcanza el estado
 * renderizado (un setter `set…(` junto a `useState`, o el uso de un hook de
 * datos que expone el resultado por sí mismo).
 *
 * Los hooks de datos (`useSWR`/`useQuery`) satisfacen ambas condiciones por su
 * semántica (inician la obtención y devuelven el resultado para render), por lo
 * que su sola presencia basta.
 */
export function obtieneDatosAsincronosEnCliente(contenido: string): boolean {
  const usaHookDatos = EXPRESION_HOOK_DATOS.test(contenido);
  if (usaHookDatos) {
    return true;
  }

  const hayOperacionAsincrona =
    EXPRESION_FETCH.test(contenido) ||
    EXPRESION_AWAIT.test(contenido) ||
    EXPRESION_THEN_CHAIN.test(contenido);

  const resultadoLlegaAlEstado =
    EXPRESION_SETTER_ESTADO.test(contenido) && EXPRESION_USE_STATE.test(contenido);

  return hayOperacionAsincrona && resultadoLlegaAlEstado;
}

/**
 * Patrones que evidencian un Estado_Carga: un indicador de carga, texto de
 * espera o contenido de marcador de posición mostrado mientras la operación
 * asíncrona está pendiente (Req 6.2).
 *
 * Se reconocen identificadores/propiedades de carga comunes
 * (`loading`, `isLoading`, `cargando`, `pending`, `isFetching`), así como
 * marcadores visuales habituales (`Spinner`, `Skeleton`, `Loader`, atributo
 * `aria-busy`). La detección es deliberadamente amplia para evitar falsos
 * positivos (marcar como ausente algo que sí existe).
 */
const PATRONES_CARGA: readonly RegExp[] = [
  /\b(?:is)?[Ll]oading\b/,
  /\bcargando\b/i,
  /\b(?:is)?[Pp]ending\b/,
  /\bis[Ff]etching\b/,
  /\b(?:Spinner|Skeleton|Loader|LoadingState|Cargando)\b/,
  /aria-busy/,
];

/**
 * Patrones que evidencian un Estado_Error: un mensaje de error, ruta de
 * reintento o contenido alternativo condicionado al fallo (Req 6.3).
 *
 * Se reconocen identificadores/propiedades de error comunes
 * (`error`, `isError`, `hasError`, `errorMessage`), el manejo explícito de
 * fallos (`catch`, `onError`) y rutas de reintento o alternativas
 * (`retry`, `reintentar`, `fallback`). La detección es amplia por el mismo
 * motivo que en el Estado_Carga.
 */
const PATRONES_ERROR: readonly RegExp[] = [
  /\b(?:is|has)?[Ee]rror\b/,
  /\berrorMessage\b/,
  /\bcatch\s*\(/,
  /\bonError\b/,
  /\b(?:retry|reintentar|reintento)\b/i,
  /\bfallback\b/i,
];

/**
 * Indica si el contenido presenta un Estado_Carga (Req 6.2). Función pura.
 */
export function tieneEstadoCarga(contenido: string): boolean {
  return PATRONES_CARGA.some((patron) => patron.test(contenido));
}

/**
 * Indica si el contenido presenta un Estado_Error (Req 6.3). Función pura.
 */
export function tieneEstadoError(contenido: string): boolean {
  return PATRONES_ERROR.some((patron) => patron.test(contenido));
}

/**
 * Resultado del análisis estático de un único archivo respecto a los estados de
 * carga y error de un componente cliente.
 */
export interface AnalisisEstadosCliente {
  /** `true` si el archivo está marcado con `'use client'` (Req 6.1). */
  esCliente: boolean;
  /**
   * `true` si el componente cliente obtiene datos asíncronos en el cliente
   * cuyo resultado llega al estado renderizado (Req 6.1). Solo es relevante
   * cuando `esCliente` es `true`.
   */
  tieneDatosAsincronos: boolean;
  /**
   * Tipos de estado ausentes a reportar. Vacío cuando el componente no es
   * cliente, no tiene datos asíncronos (Req 6.4), o presenta ambos estados.
   */
  estadosAusentes: TipoEstado[];
}

/**
 * Analiza el contenido de un archivo y determina los estados de carga/error
 * ausentes según la Req 6. Función pura.
 *
 * Reglas:
 * - Si el archivo no es componente cliente, no aplica (Req 6 solo cubre
 *   `'use client'`): `estadosAusentes` vacío.
 * - Si es cliente pero no obtiene datos asíncronos en el cliente, se excluye de
 *   la evaluación (Req 6.4): `estadosAusentes` vacío.
 * - Si es cliente con datos asíncronos, se añade `"carga"` cuando falta el
 *   Estado_Carga (Req 6.2) y `"error"` cuando falta el Estado_Error (Req 6.3).
 *   El orden es siempre carga antes que error para que los hallazgos sean
 *   deterministas.
 */
export function analizarEstadosCliente(
  contenido: string,
): AnalisisEstadosCliente {
  const esCliente = esComponenteCliente(contenido);
  if (!esCliente) {
    return { esCliente: false, tieneDatosAsincronos: false, estadosAusentes: [] };
  }

  const tieneDatosAsincronos = obtieneDatosAsincronosEnCliente(contenido);
  if (!tieneDatosAsincronos) {
    return { esCliente: true, tieneDatosAsincronos: false, estadosAusentes: [] };
  }

  const estadosAusentes: TipoEstado[] = [];
  if (!tieneEstadoCarga(contenido)) {
    estadosAusentes.push("carga");
  }
  if (!tieneEstadoError(contenido)) {
    estadosAusentes.push("error");
  }

  return { esCliente: true, tieneDatosAsincronos: true, estadosAusentes };
}

/**
 * Construye el hallazgo de un estado ausente (carga o error) para un componente
 * cliente con datos asíncronos (Req 6.2, 6.3, 6.5): severidad media, con la
 * ubicación del archivo y el tipo de estado ausente indicado.
 */
function hallazgoEstadoAusente(
  archivoPosix: string,
  tipo: TipoEstado,
): Hallazgo {
  const nombreEstado = tipo === "carga" ? "Estado_Carga" : "Estado_Error";
  const descripcionCaso =
    tipo === "carga"
      ? "no presenta ninguna representación visible mientras la operación " +
        "asíncrona está pendiente (indicador de carga, texto de espera o " +
        "contenido de marcador de posición)"
      : "no presenta ninguna representación visible cuando la operación " +
        "asíncrona falla (mensaje de error, ruta de reintento o contenido " +
        "alternativo condicionado al fallo)";
  const remediacionCaso =
    tipo === "carga"
      ? "Renderizar un Estado_Carga (indicador de carga, texto de espera o " +
        "marcador de posición) mientras la promesa está pendiente."
      : "Renderizar un Estado_Error (mensaje de error, ruta de reintento o " +
        "contenido alternativo) cuando la obtención de datos falla.";

  return {
    regla: REGLA,
    archivo: archivoPosix,
    severidad: "media",
    descripcion:
      `El componente cliente \`${archivoPosix}\` obtiene datos de forma ` +
      `asíncrona en el cliente pero ${descripcionCaso}; falta el ` +
      `${nombreEstado} (tipo de estado ausente: ${tipo}).`,
    remediacion: remediacionCaso,
  };
}

/** Opciones del chequeo de estados de carga y error. */
export interface OpcionesChequeoEstadosCliente {
  /**
   * Directorio raíz del proyecto frontend sobre el que operar. Debe coincidir
   * con el usado por `walk`/`construirInventario` para que las rutas relativas
   * sean consistentes. Por defecto, el directorio de trabajo actual del proceso.
   */
  raizProyecto?: string;
  /**
   * Archivos `.ts`/`.tsx` (rutas relativas a la raíz, formato POSIX) sobre los
   * que evaluar los estados de carga/error. Normalmente provienen del
   * inventario/walker (componentes y rutas). Por defecto, vacío.
   */
  archivos?: readonly string[];
}

/**
 * Resultado del chequeo de estados de carga y error: los hallazgos de la regla
 * y las omisiones acumuladas (p. ej. archivos ilegibles).
 */
export interface ResultadoChequeoEstadosCliente {
  /** Hallazgos detectados bajo la regla `"estados-carga-error"`. */
  hallazgos: Hallazgo[];
  /** Archivos omitidos durante el chequeo, con su motivo. */
  omisiones: Omision[];
}

/**
 * Ejecuta el chequeo de estados de carga y error (Req 6) sobre los archivos
 * proporcionados y produce los `Hallazgo[]` de la regla `"estados-carga-error"`
 * junto con las omisiones encontradas.
 *
 * Para cada archivo: lo lee (registrando `Omision` y continuando si no es
 * legible o no es texto válido), analiza sus estados con
 * `analizarEstadosCliente` y, por cada estado ausente, emite un hallazgo con el
 * tipo indicado. Los componentes no cliente y los clientes sin datos asíncronos
 * no generan hallazgos (Req 6.4).
 *
 * @param opciones Raíz del proyecto y archivos a inspeccionar.
 * @returns Hallazgos y omisiones del chequeo.
 */
export async function chequearEstadosCliente(
  opciones: OpcionesChequeoEstadosCliente = {},
): Promise<ResultadoChequeoEstadosCliente> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const archivos = opciones.archivos ?? [];
  const hallazgos: Hallazgo[] = [];
  const omisiones: Omision[] = [];

  for (const archivo of archivos) {
    const archivoPosix = archivo.split(path.sep).join("/");
    const rutaAbsoluta = path.join(raizProyecto, ...archivoPosix.split("/"));
    const contenido = await leerTextoOOmitir(
      raizProyecto,
      rutaAbsoluta,
      omisiones,
    );
    if (contenido === null) {
      continue;
    }

    const analisis = analizarEstadosCliente(contenido);
    for (const tipo of analisis.estadosAusentes) {
      hallazgos.push(hallazgoEstadoAusente(archivoPosix, tipo));
    }
  }

  return { hallazgos, omisiones };
}
