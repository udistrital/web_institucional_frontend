// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import fc from "fast-check";

import Footer from "./footer/Footer/Footer";
import Brand from "./header/Brand/Brand";
import ContactWidget from "./contact-widget/ContactWidget/ContactWidget";
import Tarjet from "./tarjet/Tarjet/Tarjet";
import AudienceButton from "./header/audience-nav/AudienceButton/AudienceButton";
import type { ServiceProfile } from "@/navegation/audience_services";

/**
 * Prueba de propiedad de composición mediante `className` (tarea 11.1*).
 *
 * Feature: global-standardization-and-cleanup, Property 7: Composición mediante
 * className.
 *
 * Validates: Requirements 5.2, 5.3.
 *
 * Esta prueba ejercita el contrato real de composición de los componentes
 * estandarizados que aplican el patrón de merge
 * `[...clasesBase, className].filter(Boolean).join(" ")` sobre su elemento
 * raíz. Se renderiza cada componente a markup estático con
 * `renderToStaticMarkup` (sin `@testing-library/react`, usando únicamente
 * `react-dom/server` y el entorno jsdom ya configurado para `components/**`) y
 * se inspecciona el conjunto de clases del elemento raíz mediante `classList`,
 * que es exactamente la semántica que el navegador aplica (los tokens de clase
 * ignoran espacios en blanco).
 *
 * Componentes cubiertos (presentacionales, renderizables sin red ni contexto
 * pesado):
 * - `Footer`   — raíz `<footer>`, clases base en literal Tailwind.
 * - `Brand`    — raíz `<a>` (next/link), clases base en literal Tailwind,
 *   usa next/image (que en el DOM de pruebas produce un elemento de imagen).
 * - `Tarjet`   — raíz `<a>` (next/link), clase base de CSS Module.
 * - `ContactWidget` — raíz `<div>`, clase base de CSS Module.
 * - `AudienceButton` — raíz `<div>`, clase base de CSS Module (el estado
 *   cerrado no añade modificadores), usa framer-motion.
 *
 * Componentes excluidos y por qué:
 * - `Header`, `MainMenu` y menús (`Buscador`, etc.): dependen de hooks de
 *   layout (`use-hide-on-scroll` con `ResizeObserver`/listeners de scroll) y de
 *   composición de muchos hijos; no son hojas presentacionales puras.
 * - `EmisoraLive`/`PlayButton`/`VolumeSlider`: dependen de audio del cliente
 *   (`useRadio`) y se validan por la Property 8 (tarea 11.2).
 * Los cinco cubiertos comparten el mismo patrón de merge, por lo que verifican
 * de forma representativa el contrato de la Property 7 para toda la familia de
 * componentes estandarizados.
 */

/**
 * Caso bajo prueba: una función que, dado un `className` (o su ausencia),
 * produce el elemento React a renderizar, más el conjunto de clases base
 * esperadas en el elemento raíz cuando no se compone ninguna clase extra.
 */
type Caso = {
  readonly nombre: string;
  readonly render: (className?: string) => ReactElement;
};

/** Perfil mínimo válido para `Tarjet`/`AudienceButton`. */
const perfil: ServiceProfile = {
  label: "Aspirantes",
  href: "/perfiles/aspirantes",
  children: [
    { label: "Primer ingreso", href: "/perfiles/aspirantes/primer-ingreso" },
    { label: "Reingreso", href: "/perfiles/aspirantes/reingreso" },
  ],
};

const casos: readonly Caso[] = [
  { nombre: "Footer", render: (c) => <Footer className={c} /> },
  { nombre: "Brand", render: (c) => <Brand className={c} /> },
  {
    nombre: "Tarjet",
    render: (c) => <Tarjet service={perfil} className={c} />,
  },
  { nombre: "ContactWidget", render: (c) => <ContactWidget className={c} /> },
  {
    nombre: "AudienceButton",
    render: (c) => <AudienceButton profile={perfil} className={c} />,
  },
];

/**
 * Devuelve el conjunto (orden-independiente) de tokens de clase del elemento
 * raíz del markup renderizado, usando `classList` para replicar la semántica
 * del navegador (los espacios en blanco entre tokens no cuentan como clases).
 */
function clasesRaiz(elemento: ReactElement): Set<string> {
  const html = renderToStaticMarkup(elemento);
  const doc = new DOMParser().parseFromString(html, "text/html");
  const raiz = doc.body.firstElementChild;
  if (!raiz) {
    throw new Error("El componente no renderizó un elemento raíz.");
  }
  return new Set(raiz.classList);
}

/**
 * Token de clase "seguro": empieza por letra, continúa con letras, dígitos,
 * guiones o guiones bajos. Sin espacios en blanco, de modo que represente un
 * único token de clase (como lo trataría `classList`).
 */
const arbTokenClase = fc
  .stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,24}$/)
  .filter((s) => s.length > 0);

/** `className` no vacío: 1..4 tokens separados por espacios. */
const arbClassNameNoVacio = fc
  .array(arbTokenClase, { minLength: 1, maxLength: 4 })
  .map((tokens) => tokens.join(" "));

/** `className` "vacío a efectos de clase": undefined, "" o solo espacios. */
const arbClassNameVacio = fc.oneof(
  fc.constant(undefined),
  fc.constant(""),
  fc
    .array(fc.constantFrom(" ", "\t", "\n"), { minLength: 1, maxLength: 5 })
    .map((partes) => partes.join("")),
);

/**
 * Entrada generada: un componente del conjunto representativo y un `className`
 * que puede ser no vacío (rama A) o vacío-a-efectos-de-clase (rama B).
 */
const arbEntrada = fc.record({
  caso: fc.constantFrom(...casos),
  className: fc.oneof(
    arbClassNameNoVacio.map((valor) => ({ tipo: "no-vacio" as const, valor })),
    arbClassNameVacio.map((valor) => ({ tipo: "vacio" as const, valor })),
  ),
});

describe("Property 7 — Composición mediante className en componentes estandarizados", () => {
  it("Feature: global-standardization-and-cleanup, Property 7: Composición mediante className", () => {
    fc.assert(
      fc.property(arbEntrada, ({ caso, className }) => {
        // Conjunto de clases base: el que produce el componente sin `className`.
        const base = clasesRaiz(caso.render(undefined));

        // El elemento raíz siempre expone al menos una clase institucional.
        expect(base.size).toBeGreaterThan(0);

        const resultado = clasesRaiz(caso.render(className.valor));

        if (className.tipo === "no-vacio") {
          // Property A (Req 5.2): con `className` no vacío, el raíz contiene
          // TODAS las clases base y ADEMÁS cada token del `className` generado.
          for (const claseBase of base) {
            expect(resultado.has(claseBase)).toBe(true);
          }
          const tokensExtra = className.valor
            .split(/\s+/)
            .filter((t) => t.length > 0);
          for (const token of tokensExtra) {
            expect(resultado.has(token)).toBe(true);
          }
          // El raíz = base ∪ tokensExtra, sin introducir ninguna otra clase.
          const esperado = new Set([...base, ...tokensExtra]);
          expect(new Set(resultado)).toEqual(esperado);
        } else {
          // Property B (Req 5.3): sin `className` (undefined/""/solo espacios),
          // el raíz conserva EXACTAMENTE sus clases base, sin tokens extra.
          expect(new Set(resultado)).toEqual(base);
        }
      }),
      { numRuns: 100 },
    );
  });
});
