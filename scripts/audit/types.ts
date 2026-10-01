/**
 * Modelo de datos del Informe_Auditoria (Sistema_Auditoria).
 *
 * Estas interfaces y tipos describen la estructura del informe de auditoría
 * generado por el proceso de análisis estático del frontend. Todo está tipado
 * de forma explícita; no se usa `any`.
 *
 * Requisitos cubiertos: 7.1, 7.2, 7.3, 7.4.
 */

/**
 * Nivel de severidad de un hallazgo de auditoría (Req 7.3).
 */
export type Severidad = "alta" | "media" | "baja";

/**
 * Reglas de arquitectura evaluadas por el Sistema_Auditoria. Los hallazgos se
 * agrupan por regla en el Informe_Auditoria (Req 7.1).
 */
export type ReglaArquitectura =
  | "1-separacion-responsabilidades"
  | "2-capa-servicios"
  | "3-tipado-estricto"
  | "4-componentizacion"
  | "5-estilos"
  | "skill-estandarizacion"
  | "estados-carga-error";

/**
 * Categoría de inventario de un elemento del frontend. Se asigna exactamente
 * una categoría aplicando el orden: módulo de datos → contenedor → presentacional.
 */
export type CategoriaInventario =
  | "modulo-datos"
  | "componente-contenedor"
  | "componente-presentacional";

/**
 * Hallazgo de incumplimiento detectado durante la auditoría. Asocia el hallazgo
 * con su regla, el archivo afectado (Req 7.2), su severidad (Req 7.3) y la
 * acción de remediación recomendada (Req 7.4).
 */
export interface Hallazgo {
  /** Regla de arquitectura incumplida bajo la que se agrupa el hallazgo. */
  regla: ReglaArquitectura;
  /** Ruta del archivo afectado, relativa a la raíz del proyecto. */
  archivo: string;
  /** Número de línea de la primera ocurrencia detectada, si aplica. */
  linea?: number;
  /** Nivel de severidad del hallazgo. */
  severidad: Severidad;
  /** Descripción de lo que se detectó. */
  descripcion: string;
  /** Acción de remediación recomendada. */
  remediacion: string;
}

/**
 * Archivo omitido durante el análisis (no existe, no es legible o no es texto
 * válido). Se registra con su motivo y el análisis continúa.
 */
export interface Omision {
  /** Ruta del archivo omitido, relativa a la raíz del proyecto. */
  archivo: string;
  /** Motivo de la omisión (no existe / no legible / no es texto válido). */
  motivo: string;
}

/**
 * Entrada de inventario del frontend: clasifica un archivo en una única
 * categoría y, para rutas, enlaza su `page.tsx` asociado.
 */
export interface ItemInventario {
  /** Ruta del archivo inventariado, relativa a la raíz del proyecto. */
  archivo: string;
  /** Categoría asignada al elemento. */
  categoria: CategoriaInventario;
  /** Ruta asociada (p. ej. el `page.tsx` de una ruta), cuando aplica. */
  rutaAsociada?: string;
}

/**
 * Informe de auditoría agregado. Agrupa el inventario, los hallazgos por regla,
 * las omisiones y las reglas sin hallazgos (reportadas como cumplidas, Req 7.5).
 */
export interface InformeAuditoria {
  /** Inventario completo de elementos analizados. */
  inventario: ItemInventario[];
  /** Hallazgos agrupados por regla de arquitectura. */
  hallazgosPorRegla: Record<ReglaArquitectura, Hallazgo[]>;
  /** Archivos omitidos durante el análisis, con su motivo. */
  omisiones: Omision[];
  /** Reglas sin hallazgos, reportadas de forma explícita como cumplidas. */
  reglasCumplidas: ReglaArquitectura[];
}
