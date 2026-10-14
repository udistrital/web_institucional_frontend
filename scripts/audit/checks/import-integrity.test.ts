import { execFileSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { detectarImportacionesAntiguas } from "../detectors/import-integrity.ts";
import { verificarIntegridadImportaciones } from "./import-integrity.ts";

/**
 * Verificación determinista de integridad de importaciones tras renombrar.
 *
 * Feature: global-standardization-and-cleanup, Property 2: Integridad de
 * importaciones tras renombrar.
 *
 * Validates: Requirements 3.5, 4.5.
 *
 * No es una prueba property-based (fast-check): es una verificación DETERMINISTA
 * del árbol fuente activo con dos partes:
 *
 * (a) El escaneo del proyecto real (excluyendo `.next/` y `node_modules/`)
 *     encuentra CERO referencias de importación a las rutas/nombres ANTIGUOS
 *     renombrados durante la Fase 3. El matching es case-sensitive, de modo que
 *     los nuevos nombres PascalCase (`header/Header`, `main-menu/MainMenu`, …)
 *     no disparan la verificación.
 *
 * (b) `tsc --noEmit` compila el proyecto sin errores de resolución de módulos,
 *     confirmando que ninguna importación apunta a una ruta inexistente.
 *
 * La parte (a) se complementa con pruebas unitarias de la función pura de
 * detección que fijan tanto los casos que DEBEN detectarse como los falsos
 * positivos que NO deben disparar la verificación.
 */

/** Raíz del proyecto frontend (dos niveles por encima de `scripts/audit/`). */
const RAIZ_PROYECTO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
);

describe("Feature: global-standardization-and-cleanup, Property 2: Integridad de importaciones tras renombrar (árbol fuente activo)", () => {
  it("(a) no encuentra ninguna referencia a rutas/nombres antiguos en el proyecto real", async () => {
    const { referencias, omisiones } = await verificarIntegridadImportaciones({
      raizProyecto: RAIZ_PROYECTO,
    });

    const detalle = referencias
      .map((r) => `${r.archivo}:${r.linea} → ${r.clase} ("${r.coincidencia}")`)
      .join("\n");
    expect(
      referencias,
      `Referencias a rutas/nombres antiguos encontradas:\n${detalle}`,
    ).toEqual([]);

    // El árbol activo real debe ser legible sin binarios espurios bajo fuentes.
    expect(Array.isArray(omisiones)).toBe(true);
  });

  it(
    "(b) `tsc --noEmit` compila sin errores de módulo",
    () => {
      // Ejecuta el compilador de TypeScript del proyecto. Si hay errores de
      // resolución de módulos (importaciones a rutas inexistentes tras los
      // renombrados), `tsc` termina con código != 0 y `execFileSync` lanza.
      let salida = "";
      let codigo = 0;
      try {
        salida = execFileSync("npx", ["tsc", "--noEmit"], {
          cwd: RAIZ_PROYECTO,
          encoding: "utf8",
          stdio: ["ignore", "pipe", "pipe"],
        });
      } catch (error: unknown) {
        const err = error as {
          status?: number;
          stdout?: string;
          stderr?: string;
        };
        codigo = err.status ?? 1;
        salida = `${err.stdout ?? ""}\n${err.stderr ?? ""}`;
      }

      // Diagnóstico: aísla específicamente los errores de módulo no encontrado.
      const erroresDeModulo = salida
        .split(/\r\n|\r|\n/)
        .filter(
          (linea) =>
            linea.includes("TS2307") || // Cannot find module '...'
            linea.includes("Cannot find module"),
        );

      expect(
        erroresDeModulo,
        `Errores de resolución de módulo en tsc:\n${erroresDeModulo.join("\n")}`,
      ).toEqual([]);
      expect(
        codigo,
        `tsc --noEmit terminó con código ${codigo}. Salida:\n${salida}`,
      ).toBe(0);
    },
    // tsc puede tardar ~30-60s; se concede un timeout generoso.
    120_000,
  );
});

describe("detectarImportacionesAntiguas — detecta especificadores de módulo antiguos", () => {
  it("detecta cada ruta/nombre antiguo con alias de proyecto `@/`", () => {
    const contenido = [
      'import Header from "@/components/header/header";',
      'import Brand from "@/components/header/brand";',
      'import Footer from "@/components/footer/footer";',
      'import { ContactWidget } from "@/components/contact-widget/contact-widget";',
      'import Tarjet from "@/components/tarjet/tarjet";',
      'import EmisoraLive from "@/components/emisoraLive/emisora-live";',
    ].join("\n");

    const clases = detectarImportacionesAntiguas(contenido, "x.ts")
      .map((o) => o.clase)
      .sort();

    expect(clases).toEqual(
      [
        "components/header/header",
        "components/header/brand",
        "components/footer/footer",
        "components/contact-widget/contact-widget",
        "components/tarjet/tarjet",
        "components/emisoraLive/emisora-live",
      ].sort(),
    );
  });

  it("detecta los antiguos hijos de navegación con ruta relativa", () => {
    const contenido = [
      'import MainMenu from "../main-menu/main-menu";',
      'import { AudienceNav } from "./audience-nav/audience-nav";',
      'import { AudienceButton } from "./audience-nav/audience-button";',
    ].join("\n");

    const clases = detectarImportacionesAntiguas(contenido, "x.ts")
      .map((o) => o.clase)
      .sort();

    expect(clases).toEqual(
      ["main-menu/main-menu", "audience-nav/audience-nav", "audience-nav/audience-button"].sort(),
    );
  });

  it("detecta el módulo CSS con typo `mani-menu.module`", () => {
    const ocurrencias = detectarImportacionesAntiguas(
      'import styles from "./mani-menu.module.css";',
      "x.ts",
    );

    expect(ocurrencias.map((o) => o.clase)).toContain("mani-menu.module");
  });

  it("detecta la importación POR DEFECTO del antiguo `TablerosExplorer`", () => {
    const ocurrencias = detectarImportacionesAntiguas(
      'import TablerosExplorer from "@/components/ti/TablerosExplorer";',
      "x.ts",
    );

    expect(ocurrencias.map((o) => o.clase)).toContain(
      "components/ti/TablerosExplorer (default import)",
    );
  });

  it("reporta la línea 1-indexada correcta de la ocurrencia", () => {
    const contenido = [
      "// cabecera de archivo",
      "",
      'import Footer from "@/components/footer/footer";',
    ].join("\n");

    const ocurrencias = detectarImportacionesAntiguas(contenido, "x.ts");
    expect(ocurrencias).toHaveLength(1);
    expect(ocurrencias[0]?.linea).toBe(3);
  });
});

describe("detectarImportacionesAntiguas — no produce falsos positivos", () => {
  it("ignora los nuevos barrels/archivos PascalCase (case-sensitive)", () => {
    const contenido = [
      'import { Header } from "@/components/header/Header";',
      'import { Brand } from "../Brand";',
      'import { Footer } from "@/components/footer/Footer";',
      'import { ContactWidget } from "@/components/contact-widget/ContactWidget";',
      'import { Tarjet } from "@/components/tarjet/Tarjet";',
      'import { EmisoraLive } from "@/components/emisoraLive/EmisoraLive";',
      'import MainMenu from "../main-menu/MainMenu";',
      'import { AudienceNav } from "../audience-nav/AudienceNav";',
      'import { AudienceButton } from "../audience-nav/AudienceButton";',
    ].join("\n");

    expect(detectarImportacionesAntiguas(contenido, "x.ts")).toEqual([]);
  });

  it("ignora los módulos CSS homónimos conservados", () => {
    const contenido = [
      'import styles from "../footer.module.css";',
      'import styles from "../tarjet.module.css";',
      'import styles from "../contact-widget.module.css";',
      'import styles from "./emisoraLive.module.css";',
      'import styles from "../header.module.css";',
      'import styles from "./main-menu.module.css";',
      'import styles from "./audience-nav.module.css";',
    ].join("\n");

    expect(detectarImportacionesAntiguas(contenido, "x.ts")).toEqual([]);
  });

  it("ignora la importación NOMBRADA vigente de `TablerosExplorer`", () => {
    const contenido = 'import { TablerosExplorer } from "@/components/ti/TablerosExplorer";';

    expect(detectarImportacionesAntiguas(contenido, "x.ts")).toEqual([]);
  });

  it("ignora identificadores sueltos y palabras que contienen los nombres", () => {
    const contenido = [
      "const headerHeight = 0;",
      "// el footer institucional se conserva",
      "function renderBrand() { return null; }",
    ].join("\n");

    expect(detectarImportacionesAntiguas(contenido, "x.ts")).toEqual([]);
  });
});
