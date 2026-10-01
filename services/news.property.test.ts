import { afterEach, describe, expect, it, vi } from "vitest";
import fc from "fast-check";

import { getNews } from "@/services/news";
import type { NewsItem } from "@/services/news.types";

/**
 * Prueba de propiedad del mapper de noticias (tarea 9.2*).
 *
 * Feature: audit-frontend-architecture, Property 1: El mapeo nunca filtra
 * estructura JSON:API.
 *
 * Validates: Requirements 8.3, 8.4, 9.2.
 *
 * `mapNewsResource` es una función pura privada de `services/news.ts`; se
 * ejercita a través de la superficie pública `getNews()`, que es la forma en
 * que la Capa_Servicios entrega los `NewsItem` planos a los componentes. Se
 * mockea `fetch` para devolver respuestas JSON:API arbitrarias (con `included`
 * y `relationships` variados, y claves extra que imitan estructura JSON:API en
 * cada nivel) y se verifica que cada `NewsItem` resultante contiene exactamente
 * las claves de su interface y ninguna de `data`/`attributes`/`relationships`/
 * `included`.
 */

/** Claves exactas que define la interface `NewsItem`. */
const CLAVES_NEWS_ITEM: ReadonlyArray<keyof NewsItem> = [
  "id",
  "title",
  "description",
  "image",
  "alt",
  "href",
];

/** Claves de estructura JSON:API que jamás deben filtrarse al `NewsItem`. */
const CLAVES_JSONAPI_PROHIBIDAS: readonly string[] = [
  "data",
  "attributes",
  "relationships",
  "included",
];

/**
 * Generador de valores "basura" variados que se inyectan como claves extra en
 * los objetos JSON:API para intentar provocar fugas de estructura.
 */
const arbRuidoJsonApi = fc.oneof(
  fc.string(),
  fc.integer(),
  fc.boolean(),
  fc.constant(null),
  fc.array(fc.string(), { maxLength: 2 }),
  fc.record({
    data: fc.anything(),
    attributes: fc.anything(),
    relationships: fc.anything(),
    included: fc.anything(),
  }),
);

/** Fragmento `meta` opcional de la imagen (puede traer `alt`/`title`). */
const arbMeta = fc.option(
  fc.record(
    {
      alt: fc.option(fc.string(), { nil: undefined }),
      title: fc.option(fc.string(), { nil: undefined }),
    },
    { requiredKeys: [] },
  ),
  { nil: undefined },
);

/** Referencia opcional a la imagen dentro de `relationships.field_imagen`. */
const arbImageData = fc.option(
  fc.record(
    {
      id: fc.option(fc.uuid(), { nil: undefined }),
      meta: arbMeta,
      // Claves extra para intentar filtrar estructura.
      attributes: fc.option(arbRuidoJsonApi, { nil: undefined }),
    },
    { requiredKeys: [] },
  ),
  { nil: null },
);

/** `relationships` variado y opcional. */
const arbRelationships = fc.option(
  fc.record(
    {
      field_imagen: fc.option(
        fc.record(
          { data: arbImageData },
          { requiredKeys: [] },
        ),
        { nil: null },
      ),
      // Relación arbitraria adicional (ruido).
      field_otro: fc.option(arbRuidoJsonApi, { nil: undefined }),
    },
    { requiredKeys: [] },
  ),
  { nil: undefined },
);

/** `attributes` variado y opcional. */
const arbAttributes = fc.option(
  fc.record(
    {
      title: fc.option(fc.string(), { nil: undefined }),
      field_resumen: fc.option(fc.string(), { nil: null }),
      path: fc.option(
        fc.record(
          { alias: fc.option(fc.string(), { nil: null }) },
          { requiredKeys: [] },
        ),
        { nil: null },
      ),
      // Clave extra que imita estructura anidada.
      relationships: fc.option(arbRuidoJsonApi, { nil: undefined }),
    },
    { requiredKeys: [] },
  ),
  { nil: undefined },
);

/** Un recurso JSON:API de noticia arbitrario. */
const arbResource = fc.record(
  {
    id: fc.option(fc.uuid(), { nil: undefined }),
    type: fc.constant("node--news"),
    attributes: arbAttributes,
    relationships: arbRelationships,
    // Claves de estructura inyectadas directamente en el recurso.
    included: fc.option(arbRuidoJsonApi, { nil: undefined }),
    data: fc.option(arbRuidoJsonApi, { nil: undefined }),
  },
  { requiredKeys: ["type"] },
);

/** Un `included` arbitrario: ficheros resolubles y otros tipos de ruido. */
const arbIncludedItem = fc.oneof(
  fc.record(
    {
      type: fc.constant("file--file"),
      id: fc.uuid(),
      attributes: fc.record(
        {
          uri: fc.record({ url: fc.webPath() }),
        },
        { requiredKeys: [] },
      ),
    },
    { requiredKeys: ["type", "id"] },
  ),
  fc.record({
    type: fc.string(),
    id: fc.uuid(),
    attributes: arbRuidoJsonApi,
  }),
);

/**
 * Respuesta JSON:API arbitraria. Se limita `data` a 0..3 recursos para que el
 * `slice(0, 3)` de `getNews` no oculte ningún `NewsItem` mapeado y podamos
 * inspeccionar todos los producidos.
 */
const arbResponse = fc.record({
  data: fc.array(arbResource, { minLength: 0, maxLength: 3 }),
  included: fc.array(arbIncludedItem, { maxLength: 4 }),
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("mapNewsResource — Property 1: el mapeo nunca filtra estructura JSON:API", () => {
  it("Feature: audit-frontend-architecture, Property 1: El mapeo nunca filtra estructura JSON:API", async () => {
    await fc.assert(
      fc.asyncProperty(arbResponse, async (response) => {
        vi.spyOn(globalThis, "fetch").mockResolvedValue(
          new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }),
        );

        const { items, hasError } = await getNews();

        expect(hasError).toBe(false);

        for (const item of items) {
          const claves = Object.keys(item).sort();

          // El conjunto de claves es exactamente el de la interface NewsItem.
          expect(claves).toEqual([...CLAVES_NEWS_ITEM].sort());

          // Ninguna clave de estructura JSON:API se filtra.
          for (const prohibida of CLAVES_JSONAPI_PROHIBIDAS) {
            expect(claves).not.toContain(prohibida);
          }
        }
      }),
      { numRuns: 100 },
    );
  });
});
