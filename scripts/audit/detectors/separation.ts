/**
 * Evaluador de la regla de Separación de Responsabilidades (regla 1) del
 * Sistema_Auditoria.
 *
 * Compone los detectores de red ({@link detectarRed}) y de estructura JSON:API
 * ({@link detectarJsonApi}) sobre el contenido de un componente visual y, cuando
 * detecta una violación, construye un único {@link Hallazgo} bajo la regla
 * `"1-separacion-responsabilidades"` (Req 2.3) con el archivo y el número de
 * línea de la **primera** ocurrencia relevante (primera ocurrencia de red si la
 * hay; en su defecto, primera ocurrencia JSON:API).
 *
 * La asignación de severidad (Req 2.4) se aísla en {@link asignarSeveridad},
 * una función **pura y total** sobre el perfil `{ hayRed, hayJsonApi }`:
 *
 * - `"alta"`  — existe una petición HTTP directa (al menos una ocurrencia de red).
 * - `"media"` — hay acceso a la estructura JSON:API sin petición HTTP directa.
 * - `"baja"`  — cualquier otro caso dentro del alcance del Req 2.
 *
 * Mantener la severidad como función pura total permite verificar la Property 5
 * directamente (tarea 3.5*): para cualquier perfil se devuelve exactamente uno
 * de `{alta, media, baja}`.
 *
 * Siguiendo la redacción del Req 2.3, los hallazgos se registran para
 * violaciones de la regla: un archivo limpio (sin red y sin JSON:API) no produce
 * ningún hallazgo, por lo que {@link evaluarSeparacion} devuelve `null` en ese
 * caso.
 *
 * Requisitos cubiertos: 2.3, 2.4.
 */

import { detectarRed, type OcurrenciaRed } from "./network.ts";
import { detectarJsonApi, type OcurrenciaJsonApi } from "./jsonapi.ts";
import type { Hallazgo, ReglaArquitectura, Severidad } from "../types";

/**
 * Regla bajo la que se agrupan los hallazgos de este evaluador.
 */
const REGLA_SEPARACION: ReglaArquitectura = "1-separacion-responsabilidades";

/**
 * Perfil de incumplimiento de un componente visual respecto al alcance del
 * Requisito 2: si realiza al menos una petición HTTP directa (`hayRed`) y/o
 * accede al menos una vez a la estructura JSON:API (`hayJsonApi`).
 */
export interface PerfilSeparacion {
  /** Existe al menos una petición HTTP directa (ocurrencia de red). */
  hayRed: boolean;
  /** Existe al menos un acceso a la estructura JSON:API. */
  hayJsonApi: boolean;
}

/**
 * Asigna la severidad de un hallazgo de separación de responsabilidades a partir
 * del perfil `{ hayRed, hayJsonApi }` (Req 2.4).
 *
 * Es una función pura y total: para cualquier combinación de entradas devuelve
 * exactamente uno de `{"alta", "media", "baja"}`.
 *
 * - `"alta"`  si `hayRed` (petición HTTP directa), con independencia de JSON:API.
 * - `"media"` si `hayJsonApi` y no `hayRed` (JSON:API sin petición directa).
 * - `"baja"`  en cualquier otro caso dentro del alcance del Req 2.
 *
 * @param perfil Perfil de incumplimiento del componente.
 * @returns La severidad asignada.
 */
export function asignarSeveridad(perfil: PerfilSeparacion): Severidad {
  if (perfil.hayRed) {
    return "alta";
  }
  if (perfil.hayJsonApi) {
    return "media";
  }
  return "baja";
}

/**
 * Describe la causa del hallazgo según el perfil, para el campo `descripcion`.
 */
function describirHallazgo(perfil: PerfilSeparacion): string {
  if (perfil.hayRed && perfil.hayJsonApi) {
    return (
      "El componente visual realiza una petición HTTP directa y accede a la " +
      "estructura JSON:API."
    );
  }
  if (perfil.hayRed) {
    return "El componente visual realiza una petición HTTP directa.";
  }
  if (perfil.hayJsonApi) {
    return "El componente visual accede a la estructura JSON:API.";
  }
  return (
    "El componente visual presenta una violación de separación de " +
    "responsabilidades dentro del alcance del Requisito 2."
  );
}

/**
 * Acción de remediación recomendada para el hallazgo.
 */
const REMEDIACION_SEPARACION =
  "Trasladar la obtención de datos y la transformación de JSON:API a la " +
  "Capa_Servicios (`/services` o `/lib/api`) y entregar al componente " +
  "únicamente interfaces planas mediante `props`.";

/**
 * Determina el número de línea de la primera ocurrencia relevante: la primera
 * ocurrencia de red si existe; en su defecto, la primera ocurrencia JSON:API.
 * Devuelve `undefined` cuando no hay ninguna ocurrencia.
 */
function primeraLinea(
  ocurrenciasRed: readonly OcurrenciaRed[],
  ocurrenciasJsonApi: readonly OcurrenciaJsonApi[],
): number | undefined {
  if (ocurrenciasRed.length > 0) {
    return ocurrenciasRed[0].linea;
  }
  if (ocurrenciasJsonApi.length > 0) {
    return ocurrenciasJsonApi[0].linea;
  }
  return undefined;
}

/**
 * Evalúa un componente visual contra la regla de separación de responsabilidades
 * (Req 2.3, 2.4).
 *
 * Compone {@link detectarRed} y {@link detectarJsonApi} sobre el contenido del
 * archivo. Si existe al menos una petición HTTP directa o al menos un acceso a
 * la estructura JSON:API, registra un {@link Hallazgo} con la regla
 * `"1-separacion-responsabilidades"`, la severidad calculada por
 * {@link asignarSeveridad} y la línea de la primera ocurrencia relevante.
 *
 * Un archivo limpio (sin red ni JSON:API) no constituye una violación y, por
 * tanto, no genera hallazgo: en ese caso devuelve `null`.
 *
 * @param contenido Contenido textual del archivo a evaluar.
 * @param archivo Ruta del archivo (relativa a la raíz del proyecto).
 * @returns El hallazgo detectado, o `null` si el archivo no viola la regla.
 */
export function evaluarSeparacion(
  contenido: string,
  archivo: string,
): Hallazgo | null {
  const ocurrenciasRed = detectarRed(contenido, archivo);
  const ocurrenciasJsonApi = detectarJsonApi(contenido, archivo);

  const perfil: PerfilSeparacion = {
    hayRed: ocurrenciasRed.length > 0,
    hayJsonApi: ocurrenciasJsonApi.length > 0,
  };

  if (!perfil.hayRed && !perfil.hayJsonApi) {
    return null;
  }

  const hallazgo: Hallazgo = {
    regla: REGLA_SEPARACION,
    archivo,
    severidad: asignarSeveridad(perfil),
    descripcion: describirHallazgo(perfil),
    remediacion: REMEDIACION_SEPARACION,
  };

  const linea = primeraLinea(ocurrenciasRed, ocurrenciasJsonApi);
  if (linea !== undefined) {
    hallazgo.linea = linea;
  }

  return hallazgo;
}
