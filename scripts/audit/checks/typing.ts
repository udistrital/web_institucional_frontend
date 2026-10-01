/**
 * Chequeo de tipado estricto del Sistema_Auditoria (regla 3: Tipado Estricto).
 *
 * Reúne las tres fuentes de evidencia de la Req 4 y las convierte en
 * `Hallazgo[]` bajo la regla `"3-tipado-estricto"`:
 *
 * 1. **Compilación TypeScript** (`tsc --noEmit`): se ejecuta sobre el proyecto y
 *    cada error de tipos reportado se convierte en un hallazgo con su archivo y
 *    número de línea cuando el compilador los expone (Req 4.1).
 * 2. **`strict` en `tsconfig.json`** (Req 4.3, 4.4): se lee
 *    `compilerOptions.strict`; si no está definida o su valor no es `true`, se
 *    registra un hallazgo indicando la ruta del archivo de configuración. Si el
 *    `tsconfig.json` no existe o no es legible/parseable, se registra una
 *    `Omision` y el análisis continúa.
 * 3. **`any` y props sin tipo** (Req 4.1, 4.2, 4.5): sobre el contenido de cada
 *    archivo `.ts`/`.tsx` se detectan los usos explícitos del tipo `any` y los
 *    componentes cuyas props carecen de una `interface`/`type` que las declare,
 *    registrando archivo y línea de cada aparición.
 *
 * Diseño orientado a testabilidad: la detección textual (`detectarAny`,
 * `detectarPropsSinTipo`) y el parseo de `strict`
 * (`evaluarStrictDesdeContenido`) son **funciones puras** que reciben contenido
 * + ruta y no tocan el sistema de archivos. La orquestación (`chequearTipado`)
 * ejecuta `tsc`, lee archivos vía `leerTextoOOmitir` (reutilizando el manejo de
 * omisiones del walker) y agrega los hallazgos.
 *
 * Requisitos cubiertos: 4.1, 4.2, 4.3, 4.4, 4.5.
 */

import { execFile } from "node:child_process";
import * as path from "node:path";
import { promisify } from "node:util";

import type { Hallazgo, Omision } from "../types";
import { leerTextoOOmitir } from "../walk.ts";

const ejecutarArchivo = promisify(execFile);

/** Regla de arquitectura bajo la que se agrupan los hallazgos de este chequeo. */
const REGLA = "3-tipado-estricto" as const;

/** Nombre del archivo de configuración de TypeScript inspeccionado. */
const ARCHIVO_TSCONFIG = "tsconfig.json";

/**
 * Ocurrencia textual (archivo + línea 1-indexada) de un patrón de tipado
 * detectado por las funciones puras de este módulo.
 */
export interface OcurrenciaTipado {
  /** Ruta del archivo donde se detectó, relativa a la raíz del proyecto. */
  archivo: string;
  /** Número de línea de la ocurrencia (1-indexado). */
  linea: number;
}

/**
 * Resultado de evaluar la opción `strict` de un `tsconfig.json`.
 */
export interface ResultadoStrict {
  /** `true` solo cuando `compilerOptions.strict` es exactamente `true`. */
  esEstricto: boolean;
  /** Valor leído de `strict` (`undefined` si no está definida). */
  valor: boolean | undefined;
}

/**
 * Divide el contenido de un archivo en líneas conservando la correspondencia
 * 1-indexada con el documento original. Admite finales de línea `\n`, `\r\n` y
 * `\r` para que el número de línea reportado coincida con el del editor.
 */
function dividirEnLineas(contenido: string): string[] {
  return contenido.split(/\r\n|\r|\n/);
}

/**
 * Cuenta las coincidencias de una expresión regular global dentro de una línea
 * sin depender del `lastIndex` mutable del patrón compartido.
 */
function contarCoincidencias(expresion: RegExp, linea: string): number {
  const banderas = expresion.flags.includes("g")
    ? expresion.flags
    : `${expresion.flags}g`;
  const expresionGlobal = new RegExp(expresion.source, banderas);
  return [...linea.matchAll(expresionGlobal)].length;
}

/**
 * Expresión que reconoce el uso del tipo `any` como palabra aislada, en las
 * posiciones típicas de anotación de tipo: `: any`, `<any>`, `as any`,
 * `any[]`, `Array<any>`, uniones (`| any`), etc. Se exige que `any` sea una
 * palabra completa (`\bany\b`) para no coincidir con identificadores como
 * `many`, `anyField` o `Company`.
 */
const EXPRESION_ANY = /\bany\b/g;

/**
 * Detecta cada aparición del tipo `any` explícito en el contenido de un
 * archivo TypeScript (Req 4.1). Función pura: recorre el contenido línea a
 * línea y emite una ocurrencia por cada coincidencia (puede haber varias en la
 * misma línea), con la línea 1-indexada. Devuelve `[]` cuando no hay ninguna.
 *
 * Nota: el análisis es textual (coherente con el resto de detectores) y no
 * distingue cadenas ni comentarios; se prioriza la cobertura de las anotaciones
 * de tipo reales exigiendo que `any` aparezca como palabra completa.
 *
 * @param contenido Contenido textual del archivo a analizar.
 * @param archivo Ruta del archivo (relativa a la raíz) con que se etiqueta cada
 *   ocurrencia.
 * @returns Ocurrencias de `any` detectadas, ordenadas por línea.
 */
export function detectarAny(
  contenido: string,
  archivo: string,
): OcurrenciaTipado[] {
  const ocurrencias: OcurrenciaTipado[] = [];
  const lineas = dividirEnLineas(contenido);

  lineas.forEach((linea, indice) => {
    const repeticiones = contarCoincidencias(EXPRESION_ANY, linea);
    for (let i = 0; i < repeticiones; i += 1) {
      ocurrencias.push({ archivo, linea: indice + 1 });
    }
  });

  return ocurrencias;
}

/**
 * Reconoce una declaración de componente de función de React y captura la
 * expresión que ocupa el lugar de las props (primer parámetro). Admite las
 * formas más comunes:
 *
 * - `function Nombre(props...) {` / `export default function Nombre(props...) {`
 * - `const Nombre = (props...) =>` / `export const Nombre: FC = (props...) =>`
 *
 * El nombre debe empezar por mayúscula (convención de componentes de React) y
 * el primer parámetro (si existe) se captura hasta el cierre del paréntesis del
 * parámetro para inspeccionar si lleva una anotación de tipo explícita.
 */
const EXPRESION_COMPONENTE_FUNCION =
  /\bfunction\s+([A-Z][A-Za-z0-9]*)\s*\(\s*([^)]*)\)/;

const EXPRESION_COMPONENTE_FLECHA =
  /\b(?:const|let|var)\s+([A-Z][A-Za-z0-9]*)\b[^=]*=\s*(?:async\s*)?\(\s*([^)]*)\)\s*(?::[^=]*)?=>/;

/**
 * Determina si la expresión del primer parámetro de un componente declara un
 * tipo explícito. Se considera tipada cuando contiene una anotación de tipo
 * TypeScript (`: Tipo`) en el parámetro (p. ej. `props: NewsProps`,
 * `{ titulo }: HeroProps`). Un parámetro sin dos puntos (`props`, `{ titulo }`)
 * se considera sin tipo explícito.
 *
 * Un componente sin parámetros (cadena vacía) no tiene props que declarar, por
 * lo que no se marca como incumplimiento.
 */
function propsTienenTipoExplicito(parametro: string): boolean {
  const parametroNormalizado = parametro.trim();
  if (parametroNormalizado === "") {
    return true;
  }
  return parametroNormalizado.includes(":");
}

/**
 * Detecta los componentes de React cuyas props carecen de una `interface`/`type`
 * explícito que las declare (Req 4.2). Función pura: recorre el contenido línea
 * a línea, identifica declaraciones de componente (función o flecha con nombre
 * en PascalCase) y, cuando el primer parámetro no lleva anotación de tipo,
 * registra el archivo y la línea del componente.
 *
 * @param contenido Contenido textual del archivo a analizar.
 * @param archivo Ruta del archivo (relativa a la raíz) con que se etiqueta cada
 *   ocurrencia.
 * @returns Ocurrencias de componentes con props sin tipo, ordenadas por línea.
 */
export function detectarPropsSinTipo(
  contenido: string,
  archivo: string,
): OcurrenciaTipado[] {
  const ocurrencias: OcurrenciaTipado[] = [];
  const lineas = dividirEnLineas(contenido);

  lineas.forEach((linea, indice) => {
    const coincidenciaFuncion = EXPRESION_COMPONENTE_FUNCION.exec(linea);
    const coincidenciaFlecha = EXPRESION_COMPONENTE_FLECHA.exec(linea);
    const parametro =
      coincidenciaFuncion?.[2] ?? coincidenciaFlecha?.[2] ?? null;
    if (parametro !== null && !propsTienenTipoExplicito(parametro)) {
      ocurrencias.push({ archivo, linea: indice + 1 });
    }
  });

  return ocurrencias;
}

/**
 * Evalúa la opción `strict` a partir del contenido de un `tsconfig.json`
 * (Req 4.3, 4.4). Función pura: parsea el JSON y lee
 * `compilerOptions.strict`. Devuelve `esEstricto: true` solo cuando el valor es
 * exactamente el booleano `true`.
 *
 * @param contenido Contenido textual del `tsconfig.json`.
 * @returns Resultado con el valor leído y si cumple el modo estricto.
 * @throws Si el contenido no es JSON válido (lo maneja el llamador como omisión).
 */
export function evaluarStrictDesdeContenido(contenido: string): ResultadoStrict {
  const parseado: unknown = JSON.parse(contenido);
  let valor: boolean | undefined;
  if (
    typeof parseado === "object" &&
    parseado !== null &&
    "compilerOptions" in parseado
  ) {
    const compilerOptions = (parseado as { compilerOptions: unknown })
      .compilerOptions;
    if (
      typeof compilerOptions === "object" &&
      compilerOptions !== null &&
      "strict" in compilerOptions
    ) {
      const strict = (compilerOptions as { strict: unknown }).strict;
      if (typeof strict === "boolean") {
        valor = strict;
      }
    }
  }
  return { esEstricto: valor === true, valor };
}

/**
 * Error de compilación de TypeScript parseado desde la salida de `tsc`.
 */
export interface ErrorTsc {
  /** Ruta del archivo del error, relativa a la raíz del proyecto. */
  archivo: string;
  /** Número de línea del error (1-indexado). */
  linea: number;
  /** Mensaje de diagnóstico del compilador. */
  mensaje: string;
}

/**
 * Expresión que reconoce una línea de diagnóstico de `tsc` con el formato
 * `ruta(linea,columna): error TSxxxx: mensaje`.
 */
const EXPRESION_DIAGNOSTICO_TSC =
  /^(.+?)\((\d+),\d+\):\s*error\s+TS\d+:\s*(.+)$/;

/**
 * Parsea la salida de `tsc --noEmit` y extrae un error por cada línea de
 * diagnóstico con ubicación. Función pura. Las rutas se normalizan a POSIX
 * relativo a la raíz del proyecto para que los hallazgos sean estables.
 *
 * @param salida Texto combinado de `stdout`/`stderr` de `tsc`.
 * @param raizProyecto Raíz del proyecto para relativizar las rutas.
 * @returns Lista de errores de tipos con archivo, línea y mensaje.
 */
export function parsearSalidaTsc(
  salida: string,
  raizProyecto: string,
): ErrorTsc[] {
  const errores: ErrorTsc[] = [];
  for (const linea of salida.split(/\r\n|\r|\n/)) {
    const coincidencia = EXPRESION_DIAGNOSTICO_TSC.exec(linea.trim());
    if (coincidencia === null) {
      continue;
    }
    const [, rutaCruda, numeroLinea, mensaje] = coincidencia;
    const absoluta = path.resolve(raizProyecto, rutaCruda);
    const relativa = path
      .relative(raizProyecto, absoluta)
      .split(path.sep)
      .join("/");
    errores.push({
      archivo: relativa === "" ? rutaCruda : relativa,
      linea: Number.parseInt(numeroLinea, 10),
      mensaje: mensaje.trim(),
    });
  }
  return errores;
}

/** Opciones del chequeo de tipado. */
export interface OpcionesChequeoTipado {
  /**
   * Directorio raíz del proyecto frontend sobre el que operar. Por defecto, el
   * directorio de trabajo actual del proceso. Se parametriza para dirigir el
   * chequeo a árboles de prueba.
   */
  raizProyecto?: string;
  /**
   * Archivos `.ts`/`.tsx` (rutas relativas a la raíz) sobre los que detectar
   * `any` y props sin tipo. Normalmente provienen del inventario/walker.
   */
  archivos?: readonly string[];
  /**
   * Si es `false`, se omite la ejecución de `tsc --noEmit` (útil en pruebas o
   * cuando la compilación se verifica por otra vía). Por defecto `true`.
   */
  ejecutarCompilador?: boolean;
}

/**
 * Resultado del chequeo de tipado: los hallazgos de la regla y las omisiones
 * acumuladas (p. ej. `tsconfig.json` ausente/ilegible).
 */
export interface ResultadoChequeoTipado {
  /** Hallazgos detectados bajo la regla `"3-tipado-estricto"`. */
  hallazgos: Hallazgo[];
  /** Archivos omitidos durante el chequeo, con su motivo. */
  omisiones: Omision[];
}

/**
 * Determina el motivo de omisión para un error de lectura/parseo de archivo.
 */
function motivoDesdeError(error: unknown): string {
  if (error instanceof SyntaxError) {
    return "el archivo no es texto válido (JSON no parseable)";
  }
  if (error instanceof Error) {
    return `el archivo no puede leerse (${error.message})`;
  }
  return "el archivo no puede leerse";
}

/**
 * Ejecuta `tsc --noEmit` en la raíz del proyecto y devuelve su salida
 * combinada. Si `tsc` encuentra errores de tipos sale con código distinto de 0;
 * `execFile` rechaza en ese caso, pero la salida con los diagnósticos viaja en
 * el objeto de error, de donde se recupera. Si el binario no está disponible,
 * se propaga el error para que el llamador lo registre como omisión.
 */
async function ejecutarTsc(raizProyecto: string): Promise<string> {
  try {
    const { stdout, stderr } = await ejecutarArchivo(
      "npx",
      ["tsc", "--noEmit", "--pretty", "false"],
      { cwd: raizProyecto, maxBuffer: 1024 * 1024 * 32 },
    );
    return `${stdout}\n${stderr}`;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      ("stdout" in error || "stderr" in error)
    ) {
      const conSalida = error as { stdout?: string; stderr?: string };
      return `${conSalida.stdout ?? ""}\n${conSalida.stderr ?? ""}`;
    }
    throw error;
  }
}

/**
 * Ejecuta el chequeo de tipado estricto (Req 4) y produce los `Hallazgo[]` de
 * la regla `"3-tipado-estricto"` junto con las omisiones encontradas.
 *
 * Pasos:
 * 1. Ejecuta `tsc --noEmit` (salvo que se desactive) y convierte cada error de
 *    tipos en un hallazgo con archivo + línea (Req 4.1).
 * 2. Lee `tsconfig.json`; si `compilerOptions.strict` no es `true`, registra un
 *    hallazgo con la ruta del archivo de configuración (Req 4.3, 4.4). Un
 *    `tsconfig.json` ausente/ilegible/no parseable se registra como `Omision`.
 * 3. Por cada archivo `.ts`/`.tsx` proporcionado, detecta `any` explícito y
 *    props sin tipo, registrando un hallazgo por cada ocurrencia con archivo +
 *    línea (Req 4.2, 4.5). Los archivos ilegibles se registran como `Omision`.
 */
export async function chequearTipado(
  opciones: OpcionesChequeoTipado = {},
): Promise<ResultadoChequeoTipado> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const archivos = opciones.archivos ?? [];
  const ejecutarCompilador = opciones.ejecutarCompilador ?? true;
  const hallazgos: Hallazgo[] = [];
  const omisiones: Omision[] = [];

  // --- 1. Compilación TypeScript (Req 4.1) ---
  if (ejecutarCompilador) {
    try {
      const salida = await ejecutarTsc(raizProyecto);
      for (const error of parsearSalidaTsc(salida, raizProyecto)) {
        hallazgos.push({
          regla: REGLA,
          archivo: error.archivo,
          linea: error.linea,
          severidad: "alta",
          descripcion: `Error de compilación de TypeScript: ${error.mensaje}`,
          remediacion:
            "Corregir el error de tipos para que `tsc --noEmit` finalice sin errores.",
        });
      }
    } catch (error: unknown) {
      omisiones.push({
        archivo: ARCHIVO_TSCONFIG,
        motivo: `no se pudo ejecutar la compilación de TypeScript (${motivoDesdeError(error)})`,
      });
    }
  }

  // --- 2. tsconfig.compilerOptions.strict (Req 4.3, 4.4) ---
  const rutaTsconfigAbsoluta = path.join(raizProyecto, ARCHIVO_TSCONFIG);
  const contenidoTsconfig = await leerTextoOOmitir(
    raizProyecto,
    rutaTsconfigAbsoluta,
    omisiones,
  );
  if (contenidoTsconfig !== null) {
    try {
      const resultado = evaluarStrictDesdeContenido(contenidoTsconfig);
      if (!resultado.esEstricto) {
        const valorTexto =
          resultado.valor === undefined
            ? "no está definida"
            : `tiene el valor \`${String(resultado.valor)}\``;
        hallazgos.push({
          regla: REGLA,
          archivo: ARCHIVO_TSCONFIG,
          severidad: "alta",
          descripcion: `La opción \`compilerOptions.strict\` ${valorTexto}; el tipado estricto no está garantizado.`,
          remediacion:
            "Definir `\"strict\": true` en `compilerOptions` de tsconfig.json.",
        });
      }
    } catch (error: unknown) {
      omisiones.push({
        archivo: ARCHIVO_TSCONFIG,
        motivo: motivoDesdeError(error),
      });
    }
  }

  // --- 3. `any` explícito y props sin tipo (Req 4.1, 4.2, 4.5) ---
  for (const archivo of archivos) {
    const rutaAbsoluta = path.join(raizProyecto, ...archivo.split("/"));
    const contenido = await leerTextoOOmitir(raizProyecto, rutaAbsoluta, omisiones);
    if (contenido === null) {
      continue;
    }
    for (const ocurrencia of detectarAny(contenido, archivo)) {
      hallazgos.push({
        regla: REGLA,
        archivo: ocurrencia.archivo,
        linea: ocurrencia.linea,
        severidad: "alta",
        descripcion: "Uso del tipo `any`, prohibido por la regla de tipado estricto.",
        remediacion:
          "Reemplazar `any` por una interface o `type` explícito que describa el dato.",
      });
    }
    for (const ocurrencia of detectarPropsSinTipo(contenido, archivo)) {
      hallazgos.push({
        regla: REGLA,
        archivo: ocurrencia.archivo,
        linea: ocurrencia.linea,
        severidad: "media",
        descripcion:
          "Componente con props sin una `interface`/`type` explícito que las declare.",
        remediacion:
          "Declarar las props del componente con una interface o `type` explícito.",
      });
    }
  }

  return { hallazgos, omisiones };
}
