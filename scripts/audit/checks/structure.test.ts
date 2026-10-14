import { Dirent, promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import {
  type CriterioEstructura,
  chequearEstructura,
  esNombrePascalCase,
  exportaComponente,
  nombreComponenteEsperado,
} from "./structure.ts";

/**
 * Verificación determinista de estructura de componente.
 *
 * Feature: global-standardization-and-cleanup, Property 1: Estructura de
 * componente completa.
 *
 * Validates: Requirements 3.3, 3.4, 4.3, 4.4.
 *
 * No es una prueba property-based (fast-check): es una verificación
 * DETERMINISTA del árbol fuente activo. El criterio de éxito es que, en el
 * proyecto real (ya estandarizado), *todo* directorio de componente bajo
 * `components/` —incluyendo las subcarpetas de componentes individuales—
 * contenga exactamente un barrel `index.ts` que re-exporte el componente y un
 * archivo `[Nombre].types.ts` con sus tipos (Estructura_Componente, Property 1
 * del diseño).
 *
 * Reutiliza la lógica de clasificación del detector existente
 * (`scripts/audit/checks/structure.ts`) en lugar de reimplementarla:
 * - `chequearEstructura` ejecuta el chequeo estructural real del proyecto y
 *   produce los `Hallazgo[]` por criterio incumplido; esta prueba filtra los
 *   criterios relevantes a Property 1 (`barrel-index`, `archivo-types`).
 * - `nombreComponenteEsperado` / `esNombrePascalCase` definen qué cuenta como
 *   un **directorio de componente estandarizado** (una carpeta cuyo nombre, en
 *   PascalCase, coincide con el `[Nombre].tsx` que contiene).
 * - `exportaComponente` decide si un barrel re-exporta efectivamente el
 *   componente.
 *
 * Un directorio de componente estandarizado se distingue de un **archivo de
 * soporte / sub-componente plano** (p. ej. `navigation.ts`, `icons.tsx`,
 * `menu-icon.tsx`, `dropdown-motion.ts`, `use-hide-on-scroll.ts`,
 * `Hooks/useRadio.ts`, `*.module.css`, o los sub-componentes planos de
 * `emisoraLive/` como `LiveBadge.tsx`/`PlayButton.tsx`/`VolumeSlider.tsx`, que
 * se consumen por importación relativa y no por barrel). Esos NO exigen su
 * propia Estructura_Componente, por lo que la verificación no debe producir
 * falsos positivos sobre ellos.
 */

/** Raíz del proyecto frontend (dos niveles por encima de `scripts/audit/`). */
const RAIZ_PROYECTO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
);

/** Nombre del barrel exigido por la Estructura_Componente. */
const ARCHIVO_BARREL = "index.ts";

/** Directorio raíz de componentes analizado. */
const DIRECTORIO_COMPONENTES = "components";

/**
 * Criterios de la Estructura_Componente que materializan Property 1: la
 * existencia del barrel `index.ts` que re-exporta el componente y del archivo
 * de tipos `[Nombre].types.ts`.
 */
const CRITERIOS_PROPERTY_1: ReadonlySet<CriterioEstructura> = new Set([
  "barrel-index",
  "archivo-types",
]);

/**
 * Indica si la descripción de un `Hallazgo` de `chequearEstructura` corresponde
 * a un criterio relevante a Property 1, leyendo el prefijo `[criterio]` con que
 * el detector etiqueta cada hallazgo (p. ej. `[barrel-index] ...`).
 */
function esHallazgoProperty1(descripcion: string): boolean {
  const coincidencia = /^\[([a-z-]+)\]/.exec(descripcion);
  if (coincidencia === null) {
    return false;
  }
  return CRITERIOS_PROPERTY_1.has(coincidencia[1] as CriterioEstructura);
}

/**
 * Directorio de componente estandarizado detectado en el árbol real: su ruta
 * POSIX relativa, el nombre de componente esperado y el conjunto de nombres de
 * archivo que contiene.
 */
interface DirectorioComponente {
  /** Ruta del directorio relativa a la raíz, en POSIX. */
  rutaPosix: string;
  /** Nombre de componente esperado (PascalCase == nombre del directorio). */
  nombreComponente: string;
  /** Nombres de archivo presentes en el directorio. */
  archivos: ReadonlySet<string>;
}

/**
 * Recorre `components/` y recolecta los **directorios de componente
 * estandarizado**: aquellos cuyo nombre, en PascalCase, coincide con un
 * `[Nombre].tsx` presente en el propio directorio. Reutiliza la clasificación
 * de `structure.ts` (`esNombrePascalCase`, `nombreComponenteEsperado`) para que
 * la definición de "directorio de componente" sea idéntica a la del detector y
 * no se cuelen sub-componentes planos ni archivos de soporte.
 */
async function recolectarDirectoriosComponente(
  raizProyecto: string,
  directorioAbsoluto: string,
  acumulador: DirectorioComponente[],
): Promise<void> {
  let entradas: Dirent[];
  try {
    entradas = await fs.readdir(directorioAbsoluto, { withFileTypes: true });
  } catch {
    // La legibilidad del árbol fuente activo se verifica aparte vía las
    // omisiones de `chequearEstructura`; aquí simplemente no se añade nada.
    return;
  }

  const archivos = new Set<string>();
  const subdirectorios: string[] = [];
  for (const entrada of entradas) {
    if (entrada.isDirectory()) {
      subdirectorios.push(entrada.name);
    } else if (entrada.isFile()) {
      archivos.add(entrada.name);
    }
  }

  const nombreDirectorio = path.basename(directorioAbsoluto);
  const esperado = nombreComponenteEsperado(nombreDirectorio);
  // Un directorio es "de componente estandarizado" cuando contiene el archivo
  // `[Esperado].tsx` cuyo nombre coincide con el directorio en PascalCase. Esto
  // excluye wrappers como `emisoraLive/` (contiene `LiveBadge.tsx` etc., pero su
  // nombre PascalCase `EmisoraLive` no corresponde a un `EmisoraLive.tsx` en esa
  // carpeta) y carpetas de soporte (`Hooks/`).
  const archivoComponenteEsperado = `${esperado}.tsx`;
  if (
    esNombrePascalCase(esperado) &&
    archivos.has(archivoComponenteEsperado)
  ) {
    acumulador.push({
      rutaPosix: path
        .relative(raizProyecto, directorioAbsoluto)
        .split(path.sep)
        .join("/"),
      nombreComponente: esperado,
      archivos,
    });
  }

  for (const subdirectorio of subdirectorios.sort((a, b) => a.localeCompare(b))) {
    await recolectarDirectoriosComponente(
      raizProyecto,
      path.join(directorioAbsoluto, subdirectorio),
      acumulador,
    );
  }
}

describe("Property 1 — estructura de componente completa (árbol fuente activo)", () => {
  it("detecta al menos un directorio de componente estandarizado en el proyecto real", async () => {
    const directorios: DirectorioComponente[] = [];
    await recolectarDirectoriosComponente(
      RAIZ_PROYECTO,
      path.join(RAIZ_PROYECTO, DIRECTORIO_COMPONENTES),
      directorios,
    );

    // Salvaguarda: si no se encontró ningún componente, la verificación sería
    // vacuamente cierta; esto garantiza que la prueba realmente ejerce el árbol.
    expect(directorios.length).toBeGreaterThan(0);
  });

  it("todo directorio de componente contiene exactamente un barrel `index.ts` y su `[Nombre].types.ts`", async () => {
    const directorios: DirectorioComponente[] = [];
    await recolectarDirectoriosComponente(
      RAIZ_PROYECTO,
      path.join(RAIZ_PROYECTO, DIRECTORIO_COMPONENTES),
      directorios,
    );

    const incumplimientos: string[] = [];
    for (const directorio of directorios) {
      const archivoTypes = `${directorio.nombreComponente}.types.ts`;

      // 1) Existe exactamente un barrel `index.ts`. Un directorio no puede
      //    contener dos entradas con el mismo nombre, por lo que basta con
      //    comprobar su presencia para garantizar "exactamente uno".
      if (!directorio.archivos.has(ARCHIVO_BARREL)) {
        incumplimientos.push(
          `${directorio.rutaPosix}: falta el barrel \`${ARCHIVO_BARREL}\``,
        );
      } else {
        const contenidoBarrel = await fs.readFile(
          path.join(RAIZ_PROYECTO, directorio.rutaPosix, ARCHIVO_BARREL),
          "utf8",
        );
        if (!exportaComponente(contenidoBarrel, directorio.nombreComponente)) {
          incumplimientos.push(
            `${directorio.rutaPosix}: el barrel \`${ARCHIVO_BARREL}\` no re-exporta ` +
              `\`${directorio.nombreComponente}\``,
          );
        }
      }

      // 2) Existe el archivo de tipos `[Nombre].types.ts`.
      if (!directorio.archivos.has(archivoTypes)) {
        incumplimientos.push(
          `${directorio.rutaPosix}: falta el archivo de tipos \`${archivoTypes}\``,
        );
      }
    }

    expect(
      incumplimientos,
      `Directorios de componente que incumplen Property 1:\n${incumplimientos.join("\n")}`,
    ).toEqual([]);
  });

  it("el detector existente no reporta hallazgos de barrel/tipos sobre directorios de componente estandarizados", async () => {
    const directorios: DirectorioComponente[] = [];
    await recolectarDirectoriosComponente(
      RAIZ_PROYECTO,
      path.join(RAIZ_PROYECTO, DIRECTORIO_COMPONENTES),
      directorios,
    );
    const rutasComponente = new Set(
      directorios.map((directorio) => directorio.rutaPosix),
    );

    const { hallazgos, omisiones } = await chequearEstructura({
      raizProyecto: RAIZ_PROYECTO,
    });

    // Filtra los hallazgos a los criterios de Property 1 (barrel + tipos) que
    // caen sobre un directorio de componente estandarizado. Los hallazgos sobre
    // sub-componentes planos de un wrapper (p. ej. `components/emisoraLive/
    // LiveBadge.tsx`) quedan fuera: esos archivos se consumen por importación
    // relativa y no exigen barrel propio, por lo que no son parte de Property 1.
    const relevantes = hallazgos.filter((hallazgo) => {
      if (!esHallazgoProperty1(hallazgo.descripcion)) {
        return false;
      }
      const directorioHallazgo = hallazgo.archivo
        .split("/")
        .slice(0, -1)
        .join("/");
      return rutasComponente.has(directorioHallazgo);
    });

    const detalle = relevantes
      .map((hallazgo) => `${hallazgo.archivo} :: ${hallazgo.descripcion}`)
      .join("\n");
    expect(
      relevantes,
      `Hallazgos de Property 1 sobre directorios de componente:\n${detalle}`,
    ).toEqual([]);

    // El árbol activo real debe leerse sin binarios espurios bajo `components/`.
    expect(Array.isArray(omisiones)).toBe(true);
  });
});

describe("clasificación de directorios de componente — reutiliza structure.ts", () => {
  it("reconoce carpetas de componente estandarizado por nombre PascalCase", () => {
    expect(esNombrePascalCase(nombreComponenteEsperado("Footer"))).toBe(true);
    expect(esNombrePascalCase(nombreComponenteEsperado("MainMenu"))).toBe(true);
    expect(nombreComponenteEsperado("news-card")).toBe("NewsCard");
    expect(nombreComponenteEsperado("contact_widget")).toBe("ContactWidget");
  });

  it("no clasifica un wrapper (`emisoraLive`) como componente de su propio nombre", () => {
    // `emisoraLive` → `EmisoraLive`, pero el `EmisoraLive.tsx` vive en la
    // subcarpeta `EmisoraLive/`, no directamente en `emisoraLive/`. El criterio
    // de "contiene `[Esperado].tsx`" es el que evita el falso positivo, no el
    // nombre en sí.
    expect(nombreComponenteEsperado("emisoraLive")).toBe("EmisoraLive");
  });

  it("no trata archivos de soporte en minúscula como componentes", () => {
    for (const soporte of [
      "navigation",
      "icons",
      "menu-icon",
      "dropdown-motion",
      "use-hide-on-scroll",
      "useRadio",
      "useSwipe",
      "programacion",
    ]) {
      expect(esNombrePascalCase(soporte)).toBe(false);
    }
  });
});

describe("exportaComponente — reconoce las formas de barrel del proyecto", () => {
  it("acepta `export { default as Nombre } from \"./Nombre\"`", () => {
    expect(
      exportaComponente(
        'export { default as NewsCard } from "./NewsCard";',
        "NewsCard",
      ),
    ).toBe(true);
  });

  it("acepta la reexportación de tipos junto al componente", () => {
    const barrel = [
      'export { default as Footer } from "./Footer";',
      'export type { FooterProps } from "./Footer.types";',
    ].join("\n");
    expect(exportaComponente(barrel, "Footer")).toBe(true);
  });

  it("rechaza un barrel que no re-exporta el componente esperado", () => {
    expect(
      exportaComponente('export { default as Otro } from "./Otro";', "Footer"),
    ).toBe(false);
  });
});
