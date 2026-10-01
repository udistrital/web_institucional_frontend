import { defineConfig } from "vitest/config";

/**
 * Configuración de Vitest para la auditoría y remediación del frontend.
 *
 * Enfoque dual (ver Testing Strategy del diseño):
 * - Proyecto `node`: entorno por defecto para el tooling de auditoría
 *   (`scripts/audit/**`) y la Capa_Servicios (`services/**`). Lógica pura,
 *   mappers y detectores verificados con `fast-check`.
 * - Proyecto `jsdom`: pruebas de render de componentes presentacionales
 *   (`components/**`). Solo render desde props, sin red ni JSON:API.
 */
export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: [
            "scripts/**/*.test.ts",
            "services/**/*.test.ts",
            "tests/**/*.test.ts",
          ],
        },
      },
      {
        extends: true,
        test: {
          name: "jsdom",
          environment: "jsdom",
          include: ["components/**/*.test.tsx", "components/**/*.test.ts"],
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["scripts/audit/**", "services/**", "components/**"],
    },
  },
});
