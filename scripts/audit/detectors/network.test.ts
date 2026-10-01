import { describe, expect, it } from "vitest";
import fc from "fast-check";

import {
  detectarRed,
  type ClaseOcurrenciaRed,
  type OcurrenciaRed,
} from "./network";

/**
 * Prueba de propiedad del detector de red (tarea 3.2*).
 *
 * Feature: audit-frontend-architecture, Property 4: El detector de red
 * identifica toda ocurrencia con su línea.
 *
 * Validates: Requirements 2.1, 2.3.
 *
 * Estrategia: se genera contenido sintético componiendo líneas de dos tipos:
 * - Líneas "ruido" sin ninguna ocurrencia de red.
 * - Líneas que incrustan un número conocido de ocurrencias de una clase
 *   concreta (`fetch(`, `XMLHttpRequest`, `require("axios")`,
 *   `require("next-drupal")`), rodeadas de ruido sin falsas coincidencias.
 *
 * A partir del plan de líneas se calcula el conjunto esperado de ocurrencias
 * (conteo exacto y línea 1-indexada correcta) y se verifica contra la salida de
 * `detectarRed`. El caso de 0 ocurrencias queda cubierto por los documentos
 * compuestos solo de líneas de ruido, que fast-check genera de forma natural.
 */

/** Fragmentos de ruido que NO deben disparar ningún patrón del detector. */
const FRAGMENTOS_RUIDO: readonly string[] = [
  "",
  "const total = 1 + 2;",
  "// comentario sin red",
  "return <div className={clase}>Hola</div>;",
  "import { useState } from \"react\";",
  "const prefetch = () => undefined;", // contiene "fetch" pero no "fetch("
  "logger.info(\"attributes son JSON:API\");",
  "export const data = buildData();", // la palabra data no es patrón de red
];

/**
 * Snippet que contiene exactamente una ocurrencia de la clase indicada. El
 * texto se mantiene en una sola línea; el ruido alrededor no añade patrones.
 */
const SNIPPET_POR_CLASE: Record<ClaseOcurrenciaRed, string> = {
  fetch: "await fetch(url)",
  "xml-http-request": "const req = new XMLHttpRequest()",
  "import-axios": 'const axios = require("axios")',
  "import-next-drupal": 'const drupal = require("next-drupal")',
};

const CLASES: readonly ClaseOcurrenciaRed[] = [
  "fetch",
  "xml-http-request",
  "import-axios",
  "import-next-drupal",
];

/** Plan de una línea: ruido puro, o K ocurrencias de una misma clase. */
type PlanLinea =
  | { tipo: "ruido" }
  | { tipo: "ocurrencias"; clase: ClaseOcurrenciaRed; repeticiones: number };

/** Generador de una línea de ruido. */
const arbRuido: fc.Arbitrary<PlanLinea> = fc.constant({ tipo: "ruido" });

/**
 * Generador de una línea con 1..3 ocurrencias de una misma clase, separadas por
 * `; ` para que coexistan en la misma línea sin fusionarse.
 */
const arbOcurrencias: fc.Arbitrary<PlanLinea> = fc.record({
  clase: fc.constantFrom(...CLASES),
  repeticiones: fc.integer({ min: 1, max: 3 }),
}).map(({ clase, repeticiones }) => ({
  tipo: "ocurrencias" as const,
  clase,
  repeticiones,
}));

/** Construye el texto de una línea a partir de su plan. */
function textoDeLinea(plan: PlanLinea, ruido: string): string {
  if (plan.tipo === "ruido") {
    return ruido;
  }
  const partes = Array.from(
    { length: plan.repeticiones },
    () => SNIPPET_POR_CLASE[plan.clase],
  );
  return partes.join("; ");
}

describe("detectarRed — Property 4: identifica toda ocurrencia con su línea", () => {
  it("reporta el conteo exacto y la línea correcta de cada ocurrencia (0 cuando no hay ninguna)", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            plan: fc.oneof(arbRuido, arbOcurrencias),
            ruido: fc.constantFrom(...FRAGMENTOS_RUIDO),
          }),
          { minLength: 0, maxLength: 40 },
        ),
        fc.constantFrom("\n", "\r\n", "\r"),
        fc.string(),
        (lineasPlan, finDeLinea, archivo) => {
          const contenido = lineasPlan
            .map(({ plan, ruido }) => textoDeLinea(plan, ruido))
            .join(finDeLinea);

          // Ocurrencias esperadas derivadas del plan (línea 1-indexada).
          const esperadas: OcurrenciaRed[] = [];
          lineasPlan.forEach(({ plan }, indice) => {
            if (plan.tipo !== "ocurrencias") {
              return;
            }
            for (let i = 0; i < plan.repeticiones; i += 1) {
              esperadas.push({
                archivo,
                linea: indice + 1,
                clase: plan.clase,
              });
            }
          });

          const obtenidas = detectarRed(contenido, archivo);

          // Conteo exacto: ni de más ni de menos.
          expect(obtenidas).toHaveLength(esperadas.length);

          // Para una sola clase por línea, el orden (por línea y por aparición)
          // coincide con el plan, por lo que la igualdad estructural verifica a
          // la vez el conteo exacto y las líneas correctas.
          expect(obtenidas).toEqual(esperadas);

          // Caso 0 hallazgos: documentos sin ocurrencias devuelven arreglo vacío.
          if (esperadas.length === 0) {
            expect(obtenidas).toEqual([]);
          }
        },
      ),
      { numRuns: 200 },
    );
  });
});
