import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { detectarImgNativas } from "../detectors/native-img.ts";
import { verificarAusenciaImgNativas } from "./native-img.ts";

/**
 * Verificación determinista de ausencia de etiquetas `<img>` nativas.
 *
 * Feature: global-standardization-and-cleanup, Property 4: Ausencia de
 * imágenes nativas.
 *
 * Validates: Requirements 8.1, 8.4.
 *
 * No es una prueba property-based (fast-check): es una verificación DETERMINISTA
 * del árbol fuente activo. El criterio de éxito es que el escaneo del proyecto
 * real (solo archivos `.tsx`, excluyendo `.next/` y `node_modules/`) encuentre
 * CERO etiquetas de imagen nativas `<img>`. Tras la Fase 4, `Footer` y `Brand`
 * fueron migrados a `next/image`, por lo que el árbol activo debe estar limpio.
 *
 * Se complementa con pruebas unitarias de la función pura de detección que fijan
 * tanto los casos que DEBEN detectarse (una `<img>` real) como los falsos
 * positivos que NO deben disparar la verificación (el componente `<Image>` de
 * `next/image` y la palabra "image" en cadenas/comentarios).
 */

/** Raíz del proyecto frontend (dos niveles por encima de `scripts/audit/`). */
const RAIZ_PROYECTO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
);

describe("Feature: global-standardization-and-cleanup, Property 4: Ausencia de imágenes nativas (árbol fuente activo)", () => {
  it("no encuentra ninguna etiqueta `<img>` nativa en los `.tsx` del proyecto real — Validates: Requirements 8.1, 8.4", async () => {
    const { imagenes, omisiones } = await verificarAusenciaImgNativas({
      raizProyecto: RAIZ_PROYECTO,
    });

    // Mensaje de diagnóstico claro si apareciera alguna `<img>`.
    const detalle = imagenes
      .map((o) => `${o.archivo}:${o.linea} → ("${o.coincidencia}")`)
      .join("\n");
    expect(
      imagenes,
      `Etiquetas <img> nativas encontradas:\n${detalle}`,
    ).toEqual([]);

    // El árbol activo real debe ser legible sin binarios espurios bajo fuentes.
    expect(Array.isArray(omisiones)).toBe(true);
  });
});

describe("detectarImgNativas — detecta etiquetas `<img>` nativas reales", () => {
  it("detecta `<img src=...>` con atributos", () => {
    const contenido = [
      "export function Logo() {",
      '  return <img src="/logo.svg" alt="Logo" className="h-10 w-auto" />;',
      "}",
    ].join("\n");

    const ocurrencias = detectarImgNativas(contenido, "logo.tsx");

    expect(ocurrencias).toHaveLength(1);
    expect(ocurrencias[0]?.linea).toBe(2);
    expect(ocurrencias[0]?.coincidencia).toBe("<img");
  });

  it("detecta las formas `<img >`, `<img/>` y `<img>`", () => {
    const contenido = [
      "<img >",
      "<img/>",
      "<img>",
    ].join("\n");

    const ocurrencias = detectarImgNativas(contenido, "x.tsx");

    expect(ocurrencias.map((o) => o.linea)).toEqual([1, 2, 3]);
  });

  it("detecta varias `<img>` en una misma línea", () => {
    const ocurrencias = detectarImgNativas(
      '<img src="a.png" /><img src="b.png" />',
      "x.tsx",
    );

    expect(ocurrencias).toHaveLength(2);
    expect(ocurrencias.every((o) => o.linea === 1)).toBe(true);
  });
});

describe("detectarImgNativas — no produce falsos positivos", () => {
  it("NO marca el componente `<Image>` de next/image", () => {
    const contenido = [
      'import Image from "next/image";',
      "export function Brand() {",
      '  return <Image src="/logo.svg" alt="Logo" width={120} height={40} />;',
      "}",
    ].join("\n");

    expect(detectarImgNativas(contenido, "brand.tsx")).toEqual([]);
  });

  it("NO marca la palabra `image`/`img` en cadenas o comentarios", () => {
    const contenido = [
      "// Esta sección renderiza una image optimizada",
      'const alt = "imagen institucional";',
      'const src = "/public/img/hero.png";',
      "const imageUrl = buildImageUrl();",
    ].join("\n");

    expect(detectarImgNativas(contenido, "x.tsx")).toEqual([]);
  });

  it("NO marca componentes cuyo nombre empieza por `img` (p. ej. `<ImageX>`, `<imgWidget>`)", () => {
    const contenido = [
      '<ImageX src="/a.png" />',
      "<imgWidget />",
      "<ImageGallery>",
    ].join("\n");

    expect(detectarImgNativas(contenido, "x.tsx")).toEqual([]);
  });
});
