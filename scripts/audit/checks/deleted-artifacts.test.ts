import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { detectarArtefactosEliminados } from "../detectors/deleted-artifacts.ts";
import { verificarAusenciaArtefactosEliminados } from "./deleted-artifacts.ts";

/**
 * Verificación determinista de ausencia de referencias a artefactos eliminados.
 *
 * Feature: global-standardization-and-cleanup, Property 3: Ausencia de
 * referencias a artefactos eliminados.
 *
 * Validates: Requirements 2.4.
 *
 * No es una prueba property-based (fast-check): es una verificación DETERMINISTA
 * del árbol fuente activo. El criterio de éxito es que el escaneo del proyecto
 * real (excluyendo `.next/` y `node_modules/`) encuentre CERO referencias de
 * importación / ruta de módulo a los artefactos borrados en la Fase 1:
 * `components/article`, `services/articles`, `services/articles.types` y
 * `app/[...slug]`.
 *
 * Se complementa con pruebas unitarias de la función pura de detección que fijan
 * tanto los casos que DEBEN detectarse como los falsos positivos que NO deben
 * disparar la verificación.
 */

/** Raíz del proyecto frontend (dos niveles por encima de `scripts/audit/`). */
const RAIZ_PROYECTO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
);

describe("Property 3 — ausencia de referencias a artefactos eliminados (árbol fuente activo)", () => {
  it("no encuentra ninguna referencia a los artefactos eliminados en el proyecto real", async () => {
    const { referencias, omisiones } =
      await verificarAusenciaArtefactosEliminados({
        raizProyecto: RAIZ_PROYECTO,
      });

    // Mensaje de diagnóstico claro si apareciera alguna referencia.
    const detalle = referencias
      .map((r) => `${r.archivo}:${r.linea} → ${r.clase} ("${r.coincidencia}")`)
      .join("\n");
    expect(referencias, `Referencias residuales encontradas:\n${detalle}`).toEqual(
      [],
    );

    // El árbol activo real debe ser legible sin binarios espurios bajo fuentes.
    expect(Array.isArray(omisiones)).toBe(true);
  });
});

describe("detectarArtefactosEliminados — detecta especificadores de módulo reales", () => {
  it("detecta imports con alias de proyecto `@/`", () => {
    const contenido = [
      'import { Article } from "@/components/article";',
      'import { getArticles } from "@/services/articles";',
      'import type { Article } from "@/services/articles.types";',
    ].join("\n");

    const ocurrencias = detectarArtefactosEliminados(contenido, "x.ts");
    const clases = ocurrencias.map((o) => o.clase).sort();

    expect(clases).toEqual(
      ["components/article", "services/articles", "services/articles.types"].sort(),
    );
  });

  it("detecta imports relativos", () => {
    const contenido = [
      'import Article from "../components/article/Article";',
      'export * from "./services/articles";',
      'import { load } from "../../services/articles.types";',
    ].join("\n");

    const clases = detectarArtefactosEliminados(contenido, "x.ts")
      .map((o) => o.clase)
      .sort();

    expect(clases).toEqual(
      ["components/article", "services/articles", "services/articles.types"].sort(),
    );
  });

  it("detecta la ruta catch-all `app/[...slug]` como ruta de módulo o de archivo", () => {
    const comoModulo = detectarArtefactosEliminados(
      'import Page from "@/app/[...slug]/page";',
      "x.ts",
    );
    const comoRuta = detectarArtefactosEliminados(
      "// archivo en /app/[...slug]/page.tsx",
      "x.ts",
    );

    expect(comoModulo.map((o) => o.clase)).toContain("app/[...slug]");
    expect(comoRuta.map((o) => o.clase)).toContain("app/[...slug]");
  });

  it("clasifica `services/articles.types` sin contarlo también como `services/articles`", () => {
    const ocurrencias = detectarArtefactosEliminados(
      'import type { A } from "@/services/articles.types";',
      "x.ts",
    );

    expect(ocurrencias).toHaveLength(1);
    expect(ocurrencias[0]?.clase).toBe("services/articles.types");
  });
});

describe("detectarArtefactosEliminados — no produce falsos positivos", () => {
  it("ignora la etiqueta HTML semántica `<article>`", () => {
    const contenido = [
      "return <article className={styles.card}>",
      "  <h2>Noticia</h2>",
      "</article>;",
    ].join("\n");

    expect(detectarArtefactosEliminados(contenido, "x.tsx")).toEqual([]);
  });

  it("ignora el tipo de contenido Drupal `node/article` de JSON:API", () => {
    const contenido = [
      'const url = "/jsonapi/node/article?filter[status]=1";',
      'fields[node--article]=drupal_internal__nid,path',
      'for (const article of json.data || []) {}',
    ].join("\n");

    expect(detectarArtefactosEliminados(contenido, "sitemap.ts")).toEqual([]);
  });

  it("ignora identificadores y palabras sueltas que contienen `article`/`articles`", () => {
    const contenido = [
      "const articleUrls: string[] = [];",
      "async function getArticleUrls() { return []; }",
      "// Lista de articles del dominio, no un import",
      "import { newsList } from \"@/services/news\";",
    ].join("\n");

    expect(detectarArtefactosEliminados(contenido, "x.ts")).toEqual([]);
  });

  it("no confunde otros servicios/componentes con los artefactos eliminados", () => {
    const contenido = [
      'import { getNews } from "@/services/news";',
      'import { NewsCard } from "@/components/news-card";',
      'import Hero from "@/components/home";',
    ].join("\n");

    expect(detectarArtefactosEliminados(contenido, "x.ts")).toEqual([]);
  });
});
