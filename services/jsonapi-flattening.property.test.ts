import { afterEach, describe, expect, it, vi } from "vitest";
import fc from "fast-check";

import { getTablerosData } from "@/services/tableros";
import type { CategoryNode, Tablero } from "@/services/tableros";

/**
 * Prueba de propiedad del aplanamiento JSON:API de la Capa_Servicios
 * (tarea 11.3*).
 *
 * Feature: global-standardization-and-cleanup, Property 9: Aplanamiento de
 * respuestas JSON:API.
 *
 * Validates: Requirements 10.2.
 *
 * `getTablerosData()` consume dos endpoints JSON:API de Drupal
 * (`/jsonapi/node/tablero` y `/jsonapi/taxonomy_term/categorias_de_tableros`)
 * y debe entregar objetos planos (`Tablero`, `CategoryNode`) conformes a sus
 * interfaces, sin exponer jamás la estructura anidada JSON:API
 * (`data`/`attributes`/`relationships`/`included`/`type`/`meta`).
 *
 * Se mockea `fetch` para que, según la URL solicitada, devuelva el cuerpo
 * JSON:API apropiado (recursos con `attributes`/`relationships`/`meta`, más
 * claves de ruido que imitan estructura JSON:API en varios niveles) y se
 * verifica que la salida nunca filtra esas claves en ningún nivel de anidación
 * (incluida la recursión por `children` y `tableros` de cada `CategoryNode`).
 */

/** Claves exactas que define la interface `Tablero`. */
const CLAVES_TABLERO: ReadonlyArray<keyof Tablero> = [
  "id",
  "title",
  "embedUrl",
  "linkTitle",
  "platform",
  "order",
  "categoryTid",
];

/** Claves exactas que define la interface `CategoryNode`. */
const CLAVES_CATEGORY_NODE: ReadonlyArray<keyof CategoryNode> = [
  "tid",
  "id",
  "name",
  "weight",
  "parentTid",
  "path",
  "children",
  "tableros",
];

/** Claves de estructura JSON:API que jamás deben filtrarse a los objetos planos. */
const CLAVES_JSONAPI_PROHIBIDAS: readonly string[] = [
  "data",
  "attributes",
  "relationships",
  "included",
  "type",
  "meta",
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
    meta: fc.anything(),
  }),
);

// ---------------------------------------------------------------------------
// Generadores de recursos JSON:API (node/tablero)
// ---------------------------------------------------------------------------

/** Referencia JSON:API opcional a la categoría de un tablero. */
const arbCategoriaRef = fc.option(
  fc.record(
    {
      id: fc.option(fc.uuid(), { nil: undefined }),
      type: fc.constant("taxonomy_term--categorias_de_tableros"),
      meta: fc.option(
        fc.record(
          {
            drupal_internal__target_id: fc.integer({ min: 1, max: 50 }),
          },
          { requiredKeys: [] },
        ),
        { nil: undefined },
      ),
      // Ruido: claves de estructura dentro de la referencia.
      attributes: fc.option(arbRuidoJsonApi, { nil: undefined }),
    },
    { requiredKeys: ["type"] },
  ),
  { nil: null },
);

/** Un recurso JSON:API de tablero arbitrario (válido). */
const arbTableroResource = fc.record(
  {
    id: fc.uuid(),
    type: fc.constant("node--tablero"),
    attributes: fc.record(
      {
        title: fc.option(fc.string(), { nil: undefined }),
        field_enlace: fc.option(
          fc.record(
            {
              uri: fc.option(fc.webUrl(), { nil: null }),
              resolvable_uri: fc.option(fc.webUrl(), { nil: null }),
              title: fc.option(fc.string(), { nil: null }),
            },
            { requiredKeys: [] },
          ),
          { nil: null },
        ),
        field_peso_orden: fc.option(fc.integer({ min: 0, max: 100 }), {
          nil: null,
        }),
        field_plataforma: fc.option(
          fc.oneof(fc.constant("superset"), fc.constant("otra"), fc.string()),
          { nil: null },
        ),
        // Ruido: clave que imita estructura anidada dentro de attributes.
        relationships: fc.option(arbRuidoJsonApi, { nil: undefined }),
      },
      { requiredKeys: [] },
    ),
    relationships: fc.record(
      {
        field_categoria: fc.option(
          fc.record({ data: arbCategoriaRef }, { requiredKeys: [] }),
          { nil: null },
        ),
      },
      { requiredKeys: [] },
    ),
    // Ruido: claves de estructura inyectadas directamente en el recurso.
    included: fc.option(arbRuidoJsonApi, { nil: undefined }),
    data: fc.option(arbRuidoJsonApi, { nil: undefined }),
  },
  { requiredKeys: ["id", "type"] },
);

/**
 * Respuesta JSON:API arbitraria para el endpoint de tableros. Se fuerza que
 * `field_enlace` produzca una URL incrustable para que algunos tableros
 * sobrevivan al filtro `t.id && t.embedUrl`.
 */
const arbTableroResponse = fc.record({
  data: fc.array(arbTableroResource, { minLength: 0, maxLength: 4 }),
  // Ruido a nivel raíz de la respuesta.
  included: fc.array(arbRuidoJsonApi, { maxLength: 3 }),
  meta: fc.option(arbRuidoJsonApi, { nil: undefined }),
});

// ---------------------------------------------------------------------------
// Generadores de recursos JSON:API (taxonomy_term/categorias_de_tableros)
// ---------------------------------------------------------------------------

/** Referencia JSON:API al padre de un término (incluye el padre "virtual"). */
const arbParentRef = fc.oneof(
  fc.record(
    {
      id: fc.constant("virtual"),
      type: fc.constant("taxonomy_term--categorias_de_tableros"),
      meta: fc.option(arbRuidoJsonApi, { nil: undefined }),
    },
    { requiredKeys: ["id", "type"] },
  ),
  fc.record(
    {
      id: fc.option(fc.uuid(), { nil: undefined }),
      type: fc.constant("taxonomy_term--categorias_de_tableros"),
      meta: fc.record(
        {
          drupal_internal__target_id: fc.integer({ min: 1, max: 50 }),
        },
        { requiredKeys: [] },
      ),
      attributes: fc.option(arbRuidoJsonApi, { nil: undefined }),
    },
    { requiredKeys: ["type"] },
  ),
);

/** Un recurso JSON:API de término (categoría) arbitrario (válido). */
const arbTermResource = fc.record(
  {
    id: fc.uuid(),
    type: fc.constant("taxonomy_term--categorias_de_tableros"),
    attributes: fc.record(
      {
        drupal_internal__tid: fc.integer({ min: 1, max: 50 }),
        name: fc.option(fc.string(), { nil: undefined }),
        weight: fc.option(fc.integer({ min: -10, max: 10 }), { nil: null }),
        // Ruido dentro de attributes.
        relationships: fc.option(arbRuidoJsonApi, { nil: undefined }),
      },
      { requiredKeys: ["drupal_internal__tid"] },
    ),
    relationships: fc.record(
      {
        parent: fc.option(
          fc.record(
            {
              data: fc.array(arbParentRef, { maxLength: 2 }),
            },
            { requiredKeys: [] },
          ),
          { nil: null },
        ),
      },
      { requiredKeys: [] },
    ),
    // Ruido a nivel de recurso.
    included: fc.option(arbRuidoJsonApi, { nil: undefined }),
    data: fc.option(arbRuidoJsonApi, { nil: undefined }),
  },
  { requiredKeys: ["id", "type"] },
);

/** Respuesta JSON:API arbitraria para el endpoint de categorías. */
const arbTermResponse = fc.record({
  data: fc.array(arbTermResource, { minLength: 0, maxLength: 4 }),
  included: fc.array(arbRuidoJsonApi, { maxLength: 3 }),
  meta: fc.option(arbRuidoJsonApi, { nil: undefined }),
});

// ---------------------------------------------------------------------------
// Aserciones recursivas de invariantes de aplanamiento
// ---------------------------------------------------------------------------

function assertTableroPlano(tablero: Tablero): void {
  const claves = Object.keys(tablero).sort();
  expect(claves).toEqual([...CLAVES_TABLERO].sort());
  for (const prohibida of CLAVES_JSONAPI_PROHIBIDAS) {
    expect(claves).not.toContain(prohibida);
  }
}

function assertCategoryNodePlano(node: CategoryNode): void {
  const claves = Object.keys(node).sort();
  expect(claves).toEqual([...CLAVES_CATEGORY_NODE].sort());
  for (const prohibida of CLAVES_JSONAPI_PROHIBIDAS) {
    expect(claves).not.toContain(prohibida);
  }

  // Recursión: cada tablero asociado y cada subcategoría mantienen la invariante.
  for (const tablero of node.tableros) {
    assertTableroPlano(tablero);
  }
  for (const child of node.children) {
    assertCategoryNodePlano(child);
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("getTablerosData — Feature: global-standardization-and-cleanup, Property 9: Aplanamiento de respuestas JSON:API", () => {
  it("Feature: global-standardization-and-cleanup, Property 9: Aplanamiento de respuestas JSON:API — Validates: Requirements 10.2", async () => {
    await fc.assert(
      fc.asyncProperty(
        arbTableroResponse,
        arbTermResponse,
        async (tableroResponse, termResponse) => {
          // Según la URL solicitada se devuelve el cuerpo JSON:API apropiado.
          vi.spyOn(globalThis, "fetch").mockImplementation(
            async (input: RequestInfo | URL) => {
              const url =
                typeof input === "string"
                  ? input
                  : input instanceof URL
                    ? input.toString()
                    : input.url;

              const body = url.includes("/jsonapi/node/tablero")
                ? tableroResponse
                : termResponse;

              return new Response(JSON.stringify(body), {
                status: 200,
                headers: { "Content-Type": "application/json" },
              });
            },
          );

          const { categories, uncategorized, hasError } =
            await getTablerosData();

          // Para entrada válida (ambos endpoints responden 200) no hay error.
          expect(hasError).toBe(false);

          // Los tableros sin categoría son objetos planos conformes.
          for (const tablero of uncategorized) {
            assertTableroPlano(tablero);
          }

          // El árbol de categorías mantiene la invariante en todos los niveles.
          for (const node of categories) {
            assertCategoryNodePlano(node);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
