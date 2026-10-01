/**
 * Runner del Sistema_Auditoria (`scripts/audit/index.ts`).
 *
 * Orquesta el proceso completo de auditoría estática del frontend y genera el
 * Informe_Auditoria en `docs/audit-report.md` (Req 7):
 *
 *   walk → inventario → detectores → chequeos → generación del informe
 *
 * Pasos:
 * 1. **Recorrido de FS** (`walk`): recolecta las rutas (`page.tsx`) bajo `app/`
 *    y los archivos de `components/`, registrando omisiones y la ausencia de
 *    rutas (Req 1.1–1.3, 2.5, 5.6).
 * 2. **Inventario** (`construirInventario`): clasifica cada elemento en una
 *    única categoría usando el detector de red dedicado (`contieneRed`) para la
 *    señal de red (Req 1.4, 1.5).
 * 3. **Detector de separación** (`evaluarSeparacion`): evalúa cada componente
 *    visual contra la regla de separación de responsabilidades, con severidad
 *    (Req 2.1–2.4).
 * 4. **Chequeos de conformidad**: Capa_Servicios (Req 3), tipado estricto
 *    (Req 4), estructura de componentes (Req 5) y estados de carga/error en
 *    componentes cliente (Req 6).
 * 5. **Agregación y generación** (`generarReporteMarkdown` / `escribirReporte`):
 *    agrupa los hallazgos por regla, calcula las reglas cumplidas (sin
 *    hallazgos, Req 7.5), fusiona las omisiones y emite el documento.
 *
 * El binario es ejecutable directamente con el soporte nativo de TypeScript de
 * Node (`node scripts/audit/index.ts`), expuesto como script `"audit"` en
 * `package.json`.
 */

import * as path from "node:path";

import { chequearEstadosCliente } from "./checks/client-state.ts";
import { chequearCapaServicios } from "./checks/services-layer.ts";
import { chequearEstructura } from "./checks/structure.ts";
import { chequearTipado } from "./checks/typing.ts";
import { contieneRed } from "./detectors/network.ts";
import { evaluarSeparacion } from "./detectors/separation.ts";
import { construirInventario } from "./inventory.ts";
import { escribirReporte, generarReporteMarkdown } from "./report.ts";
import type {
  Hallazgo,
  InformeAuditoria,
  Omision,
  ReglaArquitectura,
} from "./types.ts";
import { leerTextoOOmitir, walk } from "./walk.ts";
import type { ResultadoWalk } from "./walk.ts";

/** Reglas de arquitectura evaluadas por el runner (orden canónico del informe). */
const REGLAS: readonly ReglaArquitectura[] = [
  "1-separacion-responsabilidades",
  "2-capa-servicios",
  "3-tipado-estricto",
  "4-componentizacion",
  "5-estilos",
  "skill-estandarizacion",
  "estados-carga-error",
];

/** Opciones del runner de auditoría. */
export interface OpcionesAuditoria {
  /**
   * Directorio raíz del proyecto frontend sobre el que operar. Por defecto, el
   * directorio de trabajo actual del proceso.
   */
  raizProyecto?: string;
  /**
   * Si es `false`, se omite la ejecución de `tsc --noEmit` dentro del chequeo de
   * tipado (útil en pruebas o entornos sin el compilador). Por defecto `true`.
   */
  ejecutarCompilador?: boolean;
}

/**
 * Construye el mapa `regla → hallazgos` inicializado con una lista vacía por
 * cada regla, de modo que toda regla aparezca en el informe (con o sin
 * hallazgos).
 */
function crearMapaHallazgos(): Record<ReglaArquitectura, Hallazgo[]> {
  const mapa = {} as Record<ReglaArquitectura, Hallazgo[]>;
  for (const regla of REGLAS) {
    mapa[regla] = [];
  }
  return mapa;
}

/**
 * Evalúa la regla de separación de responsabilidades (Req 2) sobre cada
 * componente visual recolectado por el walker. Lee el contenido de cada archivo
 * (registrando omisiones y continuando ante fallo) y acumula un hallazgo por
 * cada componente que viole la regla.
 */
async function evaluarSeparacionComponentes(
  raizProyecto: string,
  resultadoWalk: ResultadoWalk,
  omisiones: Omision[],
): Promise<Hallazgo[]> {
  const hallazgos: Hallazgo[] = [];
  for (const componente of resultadoWalk.componentes) {
    const rutaAbsoluta = path.join(raizProyecto, ...componente.archivo.split("/"));
    const contenido = await leerTextoOOmitir(raizProyecto, rutaAbsoluta, omisiones);
    if (contenido === null) {
      continue;
    }
    const hallazgo = evaluarSeparacion(contenido, componente.archivo);
    if (hallazgo !== null) {
      hallazgos.push(hallazgo);
    }
  }
  return hallazgos;
}

/**
 * Ejecuta el proceso completo de auditoría y devuelve el {@link InformeAuditoria}
 * agregado, sin escribir en disco.
 *
 * Orquesta walk → inventario → detectores → chequeos y agrupa los resultados por
 * regla, calculando las reglas cumplidas (sin hallazgos, Req 7.5) y fusionando
 * todas las omisiones registradas por los distintos pasos.
 *
 * @param opciones Raíz del proyecto y control de la compilación de tipos.
 * @returns El informe de auditoría agregado.
 */
export async function ejecutarAuditoria(
  opciones: OpcionesAuditoria = {},
): Promise<InformeAuditoria> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const ejecutarCompilador = opciones.ejecutarCompilador ?? true;

  const hallazgosPorRegla = crearMapaHallazgos();
  const omisiones: Omision[] = [];

  // --- Paso 1: recorrido de FS (Req 1.1–1.3) ---
  const resultadoWalk = await walk({ raizProyecto });
  omisiones.push(...resultadoWalk.omisiones);

  // --- Paso 2: inventario con el detector de red dedicado (Req 1.4, 1.5) ---
  const { items: inventario, omisiones: omisionesInventario } =
    await construirInventario(resultadoWalk, {
      raizProyecto,
      detectorRed: contieneRed,
    });
  omisiones.push(...omisionesInventario);

  // --- Paso 3: separación de responsabilidades (Req 2) ---
  const hallazgosSeparacion = await evaluarSeparacionComponentes(
    raizProyecto,
    resultadoWalk,
    omisiones,
  );
  hallazgosPorRegla["1-separacion-responsabilidades"].push(...hallazgosSeparacion);

  // --- Paso 4a: Capa_Servicios (Req 3) ---
  const resultadoServicios = await chequearCapaServicios({
    raizProyecto,
    inventario,
  });
  hallazgosPorRegla["2-capa-servicios"].push(...resultadoServicios.hallazgos);
  omisiones.push(...resultadoServicios.omisiones);

  // Archivos de código (`.ts`/`.tsx`) para los chequeos basados en contenido:
  // rutas de `app/` y archivos de `components/`.
  const archivosCodigo = [
    ...resultadoWalk.rutas.map((ruta) => ruta.archivo),
    ...resultadoWalk.componentes.map((componente) => componente.archivo),
  ];

  // --- Paso 4b: tipado estricto (Req 4) ---
  const resultadoTipado = await chequearTipado({
    raizProyecto,
    archivos: archivosCodigo,
    ejecutarCompilador,
  });
  hallazgosPorRegla["3-tipado-estricto"].push(...resultadoTipado.hallazgos);
  omisiones.push(...resultadoTipado.omisiones);

  // --- Paso 4c: estructura de componentes (Req 5) ---
  const resultadoEstructura = await chequearEstructura({ raizProyecto });
  hallazgosPorRegla["skill-estandarizacion"].push(
    ...resultadoEstructura.hallazgos,
  );
  omisiones.push(...resultadoEstructura.omisiones);

  // --- Paso 4d: estados de carga/error en componentes cliente (Req 6) ---
  const resultadoEstados = await chequearEstadosCliente({
    raizProyecto,
    archivos: archivosCodigo,
  });
  hallazgosPorRegla["estados-carga-error"].push(...resultadoEstados.hallazgos);
  omisiones.push(...resultadoEstados.omisiones);

  // --- Paso 5: agregación (reglas cumplidas, Req 7.5) ---
  const reglasCumplidas = REGLAS.filter(
    (regla) => hallazgosPorRegla[regla].length === 0,
  );

  return {
    inventario,
    hallazgosPorRegla,
    omisiones,
    reglasCumplidas,
  };
}

/**
 * Punto de entrada del script `"audit"`: ejecuta la auditoría y escribe el
 * Informe_Auditoria en `docs/audit-report.md`, imprimiendo un breve resumen por
 * consola.
 */
async function main(): Promise<void> {
  const raizProyecto = process.cwd();
  const informe = await ejecutarAuditoria({ raizProyecto });
  const rutaInforme = await escribirReporte(informe, { raizProyecto });

  const totalHallazgos = REGLAS.reduce(
    (acumulado, regla) => acumulado + informe.hallazgosPorRegla[regla].length,
    0,
  );
  const rutaRelativa = path
    .relative(raizProyecto, rutaInforme)
    .split(path.sep)
    .join("/");

  process.stdout.write(
    `Informe de auditoría generado en ${rutaRelativa}\n` +
      `  Elementos inventariados: ${informe.inventario.length}\n` +
      `  Hallazgos totales: ${totalHallazgos}\n` +
      `  Reglas cumplidas: ${informe.reglasCumplidas.length}\n` +
      `  Omisiones: ${informe.omisiones.length}\n`,
  );
}

// Ejecuta `main` solo cuando el módulo se invoca directamente como script.
if (
  process.argv[1] !== undefined &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename)
) {
  main().catch((error: unknown) => {
    process.stderr.write(
      `La auditoría falló: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}

export { generarReporteMarkdown };
