import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/**
 * Alias compartidos para resolver, en el entorno de pruebas:
 * - El prefijo `@/` del proyecto (equivalente a `paths` de `tsconfig.json`),
 *   para que los tests importen la Capa_Servicios igual que la app.
 * - El paquete `server-only` (provisto por Next.js en build) por un stub vacío,
 *   necesario para importar módulos de `services/**` desde Vitest.
 */
const resolveAlias = [
  {
    find: "server-only",
    replacement: fileURLToPath(
      new URL("./tests/stubs/server-only.ts", import.meta.url),
    ),
  },
  // Solo reescribe el prefijo de proyecto `@/`, sin afectar paquetes con
  // ámbito como `@vitest/...`.
  {
    find: /^@\//,
    replacement: `${fileURLToPath(new URL("./", import.meta.url))}`,
  },
];

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
  resolve: {
    alias: resolveAlias,
  },
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
