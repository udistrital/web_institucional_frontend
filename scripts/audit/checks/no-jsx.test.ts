import { Dirent, promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * Verificación determinista de ausencia de archivos sin tipar (`.jsx`) bajo
 * `components/`.
 *
 * Feature: global-standardization-and-cleanup, Property 6: Ausencia de archivos
 * sin tipar.
 *
 * Validates: Requirements 4.1, 9.1.
 *
 * No es una prueba property-based (fast-check): es una verificación DETERMINISTA
 * del árbol fuente activo. El criterio de éxito es que el escaneo del directorio
 * real `components/` (excluyendo `.next/` y `node_modules/`) encuentre CERO
 * archivos con extensión `.jsx`. Los componentes `.jsx` de `emisoraLive` se
 * convirtieron a `.tsx` tipado en la Fase 2, por lo que no debe quedar ninguno.
 */

/** Raíz del proyecto frontend (tres niveles por encima de `scripts/audit/checks/`). */
const RAIZ_PROYECTO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
);

/** Directorio de componentes a inspeccionar. */
const DIRECTORIO_COMPONENTES = path.join(RAIZ_PROYECTO, "components");

/**
 * Directorios excluidos del recorrido por no formar parte del árbol fuente
 * activo: salida de build de Next.js y dependencias.
 */
const DIRECTORIOS_EXCLUIDOS: ReadonlySet<string> = new Set([
  ".next",
  "node_modules",
]);

/** Extensión objetivo que no debe existir bajo `components/`. */
const EXTENSION_PROHIBIDA = ".jsx";

/**
 * Convierte una ruta absoluta a POSIX relativa a la raíz del proyecto, para que
 * las rutas reportadas sean estables entre sistemas.
 */
function aRutaRelativaPosix(rutaAbsoluta: string): string {
  return path.relative(RAIZ_PROYECTO, rutaAbsoluta).split(path.sep).join("/");
}

/**
 * Lee las entradas de un directorio devolviendo una lista vacía si no puede
 * leerse, para no interrumpir el recorrido.
 */
async function leerDirectorio(directorioAbsoluto: string): Promise<Dirent[]> {
  try {
    return await fs.readdir(directorioAbsoluto, { withFileTypes: true });
  } catch {
    return [];
  }
}

/**
 * Recorre recursivamente `components/` y devuelve las rutas POSIX (relativas a
 * la raíz) de todos los archivos con extensión `.jsx`. Omite por completo los
 * directorios de {@link DIRECTORIOS_EXCLUIDOS}.
 */
async function recolectarJsx(directorioAbsoluto: string): Promise<string[]> {
  const encontrados: string[] = [];
  const entradas = await leerDirectorio(directorioAbsoluto);

  for (const entrada of entradas) {
    const rutaAbsoluta = path.join(directorioAbsoluto, entrada.name);
    if (entrada.isDirectory()) {
      if (DIRECTORIOS_EXCLUIDOS.has(entrada.name)) {
        continue;
      }
      encontrados.push(...(await recolectarJsx(rutaAbsoluta)));
      continue;
    }
    if (
      entrada.isFile() &&
      path.extname(entrada.name).toLowerCase() === EXTENSION_PROHIBIDA
    ) {
      encontrados.push(aRutaRelativaPosix(rutaAbsoluta));
    }
  }

  return encontrados.sort((a, b) => a.localeCompare(b));
}

describe("Feature: global-standardization-and-cleanup, Property 6: Ausencia de archivos sin tipar (árbol fuente activo)", () => {
  it("no encuentra ningún archivo `.jsx` bajo `components/` — Validates: Requirements 4.1, 9.1", async () => {
    const archivosJsx = await recolectarJsx(DIRECTORIO_COMPONENTES);

    const detalle = archivosJsx.map((archivo) => `  - ${archivo}`).join("\n");
    expect(
      archivosJsx,
      `Se encontraron archivos .jsx sin tipar bajo components/ (deberían ser .tsx):\n${detalle}`,
    ).toEqual([]);
  });
});
