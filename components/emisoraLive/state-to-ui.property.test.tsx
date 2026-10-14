// @vitest-environment jsdom

import { describe, expect, it, vi, beforeEach } from "vitest";
import fc from "fast-check";
import { renderToStaticMarkup } from "react-dom/server";

import { PlayButton } from "./PlayButton";

/**
 * Prueba de propiedad del mapeo estado→UI de la emisora (tarea 11.2*).
 *
 * Feature: global-standardization-and-cleanup, Property 8: Mapeo de estado a UI
 * en datos asíncronos de cliente.
 *
 * Validates: Requirements 6.1, 6.2.
 *
 * `EmisoraLive` deriva su UI exclusivamente de los valores que devuelve
 * `useRadio()`. La propiedad se verifica de dos formas complementarias, ambas
 * sin construir un `Audio()` real (render puro desde estado):
 *
 *   (A) Sobre `PlayButton` (componente presentacional puro): para cualquier par
 *       de booleanos `(isPlaying, isLoading)`, `isLoading === true` implica que
 *       aparece el spinner de carga y el botón queda deshabilitado; con
 *       `isLoading === false` no hay spinner y el botón está habilitado.
 *       Cubre el mapeo loading→UI del Requisito 6.1 en el botón.
 *
 *   (B) Sobre `EmisoraLive` con `useRadio` mockeado para devolver un estado
 *       arbitrario `(isLoading, hasError, isPlaying, ...)` sin efectos de audio:
 *       `isLoading === true` ⇒ existe el indicador `role="status"`; en caso
 *       contrario no existe. `hasError === true` ⇒ existe el indicador
 *       `role="alert"`; en caso contrario no existe. Valida directamente que el
 *       estado de carga (Req. 6.1) y el estado de error (Req. 6.2) se exponen
 *       visualmente.
 */

/** Mock del hook `useRadio`: evita `new Audio()` y entrega estado controlado. */
const mockUseRadio = vi.fn();

vi.mock("./Hooks/useRadio", () => ({
  useRadio: (streamUrl: string) => mockUseRadio(streamUrl),
}));

/** Estado que devuelve `useRadio`, con callbacks no-op para el render. */
interface RadioState {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  volume: number;
  isMuted: boolean;
}

const noop = () => {};

function buildRadioReturn(state: RadioState) {
  return {
    ...state,
    togglePlay: noop,
    toggleMute: noop,
    changeVolume: noop as (val: string | number) => void,
  };
}

/** Importación perezosa tras registrar el mock de `useRadio`. */
async function renderEmisoraLive(state: RadioState): Promise<string> {
  mockUseRadio.mockReturnValue(buildRadioReturn(state));
  const { EmisoraLive } = await import("./EmisoraLive");
  return renderToStaticMarkup(<EmisoraLive />);
}

const arbState = fc.record({
  isPlaying: fc.boolean(),
  isLoading: fc.boolean(),
  hasError: fc.boolean(),
  volume: fc.double({ min: 0, max: 1, noNaN: true }),
  isMuted: fc.boolean(),
});

beforeEach(() => {
  mockUseRadio.mockReset();
});

describe("Feature: global-standardization-and-cleanup, Property 8: Mapeo de estado a UI en datos asíncronos de cliente", () => {
  it("Property 8 (A): el estado loading controla el spinner y el disabled de PlayButton — Validates: Requirements 6.1, 6.2", () => {
    fc.assert(
      fc.property(fc.boolean(), fc.boolean(), (isPlaying, isLoading) => {
        const html = renderToStaticMarkup(
          <PlayButton
            isPlaying={isPlaying}
            isLoading={isLoading}
            onToggle={noop}
          />,
        );

        const tieneSpinner = html.includes("animate-spin");
        // El atributo booleano `disabled` lo emite React como `disabled=""`;
        // se evita el falso positivo de la clase Tailwind `disabled:opacity-50`.
        const estaDeshabilitado = /\sdisabled=""/.test(html);

        // loading → spinner visible y botón deshabilitado.
        expect(tieneSpinner).toBe(isLoading);
        expect(estaDeshabilitado).toBe(isLoading);
      }),
      { numRuns: 100 },
    );
  });

  it("Property 8 (B): isLoading↔role=status y hasError↔role=alert en EmisoraLive — Validates: Requirements 6.1, 6.2", async () => {
    await fc.assert(
      fc.asyncProperty(arbState, async (state) => {
        const html = await renderEmisoraLive(state);

        const tieneStatus = /role="status"/.test(html);
        const tieneAlert = /role="alert"/.test(html);

        // Req. 6.1: el indicador de carga es visible exactamente cuando loading.
        expect(tieneStatus).toBe(state.isLoading);

        // Req. 6.2: el indicador de error es visible exactamente cuando error.
        expect(tieneAlert).toBe(state.hasError);
      }),
      { numRuns: 100 },
    );
  });
});
