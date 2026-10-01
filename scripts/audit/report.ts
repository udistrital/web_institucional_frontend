/**
 * Generador del Informe_Auditoria en Markdown (Req 7).
 *
 * A partir de un {@link InformeAuditoria} ya agregado, produce el documento
 * `docs/audit-report.md` con el siguiente formato (Req 7.1–7.5):
 *
 * - **Hallazgos agrupados por regla de arquitectura** (Req 7.1). Para cada
 *   regla con hallazgos se emite una subsección con una fila por hallazgo que
 *   incluye el archivo afectado (Req 7.2), el número de línea cuando aplica, la
 *   severidad {alta, media, baja} (Req 7.3) y la acción de remediación
 *   recomendada (Req 7.4).
 * - **"Regla cumplida" explícito** para toda regla sin hallazgos (Req 7.5).
 * - **Sección de inventario** con la clasificación de cada elemento analizado.
 * - **Sección de omisiones** con los archivos no analizados y su motivo.
 *
 * Diseño orientado a testabilidad: `generarReporteMarkdown` es una **función
 * pura** que recibe el informe y devuelve el texto Markdown; no toca el sistema
 * de archivos. La escritura a disco se expone por separado en
 * `escribirReporte`, que crea el directorio destino y guarda el documento.
 *
 * Requisitos cubiertos: 7.1, 7.2, 7.3, 7.4, 7.5.
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";

import type {
  CategoriaInventario,
  Hallazgo,
  InformeAuditoria,
  ItemInventario,
  Omision,
  ReglaArquitectura,
  Severidad,
} from "./types";

/** Ruta por defecto del Informe_Auditoria, relativa a la raíz del proyecto. */
export const RUTA_INFORME_POR_DEFECTO = "docs/audit-report.md";

/**
 * Orden canónico de las reglas en el informe. Fija la secuencia de las
 * secciones para que el documento sea estable entre ejecuciones.
 */
const ORDEN_REGLAS: readonly ReglaArquitectura[] = [
  "1-separacion-responsabilidades",
  "2-capa-servicios",
  "3-tipado-estricto",
  "4-componentizacion",
  "5-estilos",
  "skill-estandarizacion",
  "estados-carga-error",
];

/** Título legible de cada regla para los encabezados del informe. */
const TITULO_REGLA: Record<ReglaArquitectura, string> = {
  "1-separacion-responsabilidades": "Regla 1 · Separación de responsabilidades",
  "2-capa-servicios": "Regla 2 · Capa de servicios",
  "3-tipado-estricto": "Regla 3 · Tipado estricto",
  "4-componentizacion": "Regla 4 · Componentización",
  "5-estilos": "Regla 5 · Estilos",
  "skill-estandarizacion": "Skill · Estandarización de componentes",
  "estados-carga-error": "Estados de carga y error (componentes cliente)",
};

/** Etiqueta legible de cada categoría de inventario. */
const ETIQUETA_CATEGORIA: Record<CategoriaInventario, string> = {
  "modulo-datos": "Módulo de datos",
  "componente-contenedor": "Componente contenedor",
  "componente-presentacional": "Componente presentacional",
};

/** Peso de severidad para ordenar los hallazgos de más grave a menos grave. */
const PESO_SEVERIDAD: Record<Severidad, number> = {
  alta: 0,
  media: 1,
  baja: 2,
};

/**
 * Escapa los caracteres que tienen significado en una celda de tabla Markdown
 * (`|`) o que romperían el salto de línea de una fila, para que el contenido se
 * renderice literal. Las nuevas líneas se sustituyen por un espacio.
 */
function escaparCelda(texto: string): string {
  return texto.replace(/\|/g, "\\|").replace(/\r\n|\r|\n/g, " ").trim();
}

/**
 * Formatea el número de línea de un hallazgo para la tabla. Devuelve el número
 * como texto, o `—` cuando el hallazgo no tiene línea asociada.
 */
function formatearLinea(linea: number | undefined): string {
  return linea === undefined ? "—" : String(linea);
}

/**
 * Compara dos hallazgos para un orden estable dentro de una regla: primero por
 * severidad (alta → baja), luego por archivo y, por último, por línea.
 */
function compararHallazgos(a: Hallazgo, b: Hallazgo): number {
  const porSeveridad = PESO_SEVERIDAD[a.severidad] - PESO_SEVERIDAD[b.severidad];
  if (porSeveridad !== 0) {
    return porSeveridad;
  }
  const porArchivo = a.archivo.localeCompare(b.archivo);
  if (porArchivo !== 0) {
    return porArchivo;
  }
  return (a.linea ?? 0) - (b.linea ?? 0);
}

/**
 * Genera la subsección Markdown de una regla con hallazgos: un encabezado con el
 * recuento y una tabla con archivo, línea, severidad, descripción y remediación
 * (Req 7.1–7.4).
 */
function generarSeccionRegla(
  regla: ReglaArquitectura,
  hallazgos: readonly Hallazgo[],
): string {
  const lineas: string[] = [];
  lineas.push(`### ${TITULO_REGLA[regla]}`);
  lineas.push("");

  if (hallazgos.length === 0) {
    // Regla sin hallazgos: se reporta de forma explícita como cumplida (Req 7.5).
    lineas.push("**Regla cumplida**: no se detectaron hallazgos para esta regla.");
    lineas.push("");
    return lineas.join("\n");
  }

  const plural = hallazgos.length === 1 ? "hallazgo" : "hallazgos";
  lineas.push(`${hallazgos.length} ${plural} detectados.`);
  lineas.push("");
  lineas.push("| Archivo | Línea | Severidad | Descripción | Remediación |");
  lineas.push("| --- | --- | --- | --- | --- |");
  for (const hallazgo of [...hallazgos].sort(compararHallazgos)) {
    const fila = [
      escaparCelda(hallazgo.archivo),
      formatearLinea(hallazgo.linea),
      hallazgo.severidad,
      escaparCelda(hallazgo.descripcion),
      escaparCelda(hallazgo.remediacion),
    ].join(" | ");
    lineas.push(`| ${fila} |`);
  }
  lineas.push("");
  return lineas.join("\n");
}

/**
 * Genera la sección de inventario: una tabla con cada elemento analizado, su
 * categoría y la ruta asociada (p. ej. la ruta de aplicación de un `page.tsx`).
 */
function generarSeccionInventario(
  inventario: readonly ItemInventario[],
): string {
  const lineas: string[] = [];
  lineas.push("## Inventario");
  lineas.push("");

  if (inventario.length === 0) {
    lineas.push("No se inventarió ningún elemento.");
    lineas.push("");
    return lineas.join("\n");
  }

  const ordenado = [...inventario].sort((a, b) =>
    a.archivo.localeCompare(b.archivo),
  );
  lineas.push(`${ordenado.length} elementos inventariados.`);
  lineas.push("");
  lineas.push("| Archivo | Categoría | Ruta asociada |");
  lineas.push("| --- | --- | --- |");
  for (const item of ordenado) {
    const fila = [
      escaparCelda(item.archivo),
      ETIQUETA_CATEGORIA[item.categoria],
      item.rutaAsociada === undefined ? "—" : escaparCelda(item.rutaAsociada),
    ].join(" | ");
    lineas.push(`| ${fila} |`);
  }
  lineas.push("");
  return lineas.join("\n");
}

/**
 * Genera la sección de omisiones: una tabla con cada archivo omitido y el motivo
 * por el que no pudo analizarse.
 */
function generarSeccionOmisiones(omisiones: readonly Omision[]): string {
  const lineas: string[] = [];
  lineas.push("## Omisiones");
  lineas.push("");

  if (omisiones.length === 0) {
    lineas.push("No se registraron omisiones.");
    lineas.push("");
    return lineas.join("\n");
  }

  const ordenado = [...omisiones].sort((a, b) =>
    a.archivo.localeCompare(b.archivo),
  );
  lineas.push(`${ordenado.length} omisiones registradas.`);
  lineas.push("");
  lineas.push("| Archivo | Motivo |");
  lineas.push("| --- | --- |");
  for (const omision of ordenado) {
    lineas.push(
      `| ${escaparCelda(omision.archivo)} | ${escaparCelda(omision.motivo)} |`,
    );
  }
  lineas.push("");
  return lineas.join("\n");
}

/**
 * Genera el resumen inicial del informe: recuentos de hallazgos por severidad y
 * de reglas cumplidas, para una lectura rápida del estado general.
 */
function generarResumen(informe: InformeAuditoria): string {
  const todosLosHallazgos = ORDEN_REGLAS.flatMap(
    (regla) => informe.hallazgosPorRegla[regla] ?? [],
  );
  const conteoSeveridad: Record<Severidad, number> = {
    alta: 0,
    media: 0,
    baja: 0,
  };
  for (const hallazgo of todosLosHallazgos) {
    conteoSeveridad[hallazgo.severidad] += 1;
  }

  const lineas: string[] = [];
  lineas.push("## Resumen");
  lineas.push("");
  lineas.push(`- Elementos inventariados: ${informe.inventario.length}`);
  lineas.push(`- Hallazgos totales: ${todosLosHallazgos.length}`);
  lineas.push(
    `  - Severidad alta: ${conteoSeveridad.alta} · ` +
      `media: ${conteoSeveridad.media} · baja: ${conteoSeveridad.baja}`,
  );
  lineas.push(`- Reglas cumplidas: ${informe.reglasCumplidas.length}`);
  lineas.push(`- Omisiones: ${informe.omisiones.length}`);
  lineas.push("");
  return lineas.join("\n");
}

/**
 * Genera el texto Markdown completo del Informe_Auditoria a partir de un
 * {@link InformeAuditoria} ya agregado. Función pura: no accede al sistema de
 * archivos.
 *
 * El documento incluye, en orden: un encabezado, un resumen, los hallazgos
 * agrupados por regla (con "Regla cumplida" explícito para las reglas sin
 * hallazgos, Req 7.5), la sección de inventario y la sección de omisiones.
 *
 * @param informe Informe de auditoría agregado.
 * @returns El contenido Markdown del Informe_Auditoria.
 */
export function generarReporteMarkdown(informe: InformeAuditoria): string {
  const secciones: string[] = [];

  secciones.push("# Informe de Auditoría — Arquitectura Frontend");
  secciones.push("");
  secciones.push(
    "Informe generado por el Sistema_Auditoria (`scripts/audit`). Agrupa los " +
      "hallazgos por regla de arquitectura, con el archivo afectado, la línea, " +
      "la severidad y la remediación recomendada. Las reglas sin hallazgos se " +
      "indican de forma explícita como cumplidas.",
  );
  secciones.push("");

  secciones.push(generarResumen(informe));

  secciones.push("## Hallazgos por regla");
  secciones.push("");
  for (const regla of ORDEN_REGLAS) {
    const hallazgos = informe.hallazgosPorRegla[regla] ?? [];
    secciones.push(generarSeccionRegla(regla, hallazgos));
  }

  secciones.push(generarSeccionInventario(informe.inventario));
  secciones.push(generarSeccionOmisiones(informe.omisiones));

  // Une las secciones garantizando una línea en blanco entre bloques y un único
  // salto de línea final.
  return `${secciones.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

/**
 * Escribe el Informe_Auditoria en Markdown en disco, creando el directorio
 * destino si no existe.
 *
 * @param informe Informe de auditoría agregado.
 * @param opciones Raíz del proyecto y ruta de salida (relativa a la raíz).
 * @returns La ruta absoluta del archivo escrito.
 */
export async function escribirReporte(
  informe: InformeAuditoria,
  opciones: { raizProyecto?: string; rutaSalida?: string } = {},
): Promise<string> {
  const raizProyecto = path.resolve(opciones.raizProyecto ?? process.cwd());
  const rutaSalidaRelativa = opciones.rutaSalida ?? RUTA_INFORME_POR_DEFECTO;
  const rutaAbsoluta = path.join(raizProyecto, ...rutaSalidaRelativa.split("/"));

  await fs.mkdir(path.dirname(rutaAbsoluta), { recursive: true });
  await fs.writeFile(rutaAbsoluta, generarReporteMarkdown(informe), "utf8");

  return rutaAbsoluta;
}
