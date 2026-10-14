import { Dirent, promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { detectarAny, type OcurrenciaTipado } from "./typing.ts";

/**
 * Verificación determinista de ausencia del tipo `any` en el árbol fuente
 * activo.
 *
 * Feature: global-standardization-and-cleanup, Property 5: Ausencia del tipo
 * `any`.
 *
 * Validates: Requirements 9.2.
 *
 * No es una prueba property-based (fast-check): es una verificación DETERMINISTA
 * del árbol fuente activo. El criterio de éxito es que el escaneo del proyecto
 * real (excluyendo `.next/` y `node_modules/`) encuentre CERO usos reales del
 * tipo `any` (`: any`, `as any`, `<any>`, `any[]`, `Array<any>`, `| any`, etc.).
 *
 * Reutiliza el detector puro {@link detectarAny} de `./typing.ts` (ya exportado;
 * ancla `any` como palabra completa `\bany\b`, de modo que `many`, `Company` o
 * `anyField` no coinciden). Para evitar que la palabra `any` escrita dentro de
 * comentarios o literales de cadena/plantilla produzca falsos positivos —caso
 * frecuente en la documentación del propio tooling de auditoría— el contenido
 * se pasa primero por {@link eliminarComentariosYCadenas} antes de delegar en
 * el detector. Esto preserva el comportamiento del detector puro y traslada el
 * tratamiento de comentarios/cadenas a la capa de escaneo.
 *
 * Además, los archivos de la propia herramienta de auditoría que contienen la
 * palabra `any` como DATO (el detector la define en su documentación/regex y
 * este test la usa como fixture) se excluyen del escaneo del árbol activo, de
 * forma análoga a `ARCHIVOS_HERRAMIENTA_EXCLUIDOS` en `./deleted-artifacts.ts`.
 */

/** Raíz del proyecto frontend (tres niveles por encima de `scripts/audit/checks/`). */
const RAIZ_PROYECTO = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "..",
);

/** Extensiones de archivo TypeScript analizadas por la propiedad. */
const EXTENSIONES_FUENTE: ReadonlySet<string> = new Set([".ts", ".tsx"]);

/**
 * Directorios excluidos del recorrido por no formar parte del árbol fuente
 * activo: salida de build de Next.js, dependencias y metadatos de VCS/IDE.
 */
const DIRECTORIOS_EXCLUIDOS: ReadonlySet<string> = new Set([
  ".next",
  "node_modules",
  ".git",
  "coverage",
  "dist",
  "build",
  "out",
]);

/**
 * Archivos de la propia herramienta de auditoría que contienen la palabra
 * `any` de forma intencionada como DATOS: el detector la documenta y define en
 * su patrón (`./typing.ts`) y este test la usa como fixture de entrada. No son
 * usos reales del tipo `any`, por lo que se excluyen del escaneo del árbol
 * activo (coherente con tratar "ejemplos en el tooling de auditoría" como
 * no-ocurrencias). Rutas POSIX relativas a la raíz del proyecto.
 */
const ARCHIVOS_HERRAMIENTA_EXCLUIDOS: ReadonlySet<string> = new Set([
  "scripts/audit/checks/typing.ts",
  "scripts/audit/checks/typing.test.ts",
]);

/**
 * Elimina comentarios de línea (`// ...`), de bloque (`/* ... *\/`) y literales
 * de cadena (`"..."`, `'...'`) y de plantilla (`` `...` ``) del contenido de un
 * archivo TypeScript, sustituyéndolos por espacios de la misma longitud total
 * de líneas para conservar la correspondencia 1-indexada de líneas. Es un
 * tokenizador textual simple (no un parser completo), suficiente para que la
 * palabra `any` que aparezca únicamente dentro de comentarios o cadenas no se
 * confunda con una anotación de tipo real.
 */
export function eliminarComentariosYCadenas(contenido: string): string {
  let resultado = "";
  let i = 0;
  const n = contenido.length;

  const esSalto = (c: string): boolean => c === "\n" || c === "\r";

  while (i < n) {
    const c = contenido[i];
    const siguiente = i + 1 < n ? contenido[i + 1] : "";

    // Comentario de línea: `// ...` hasta el fin de línea.
    if (c === "/" && siguiente === "/") {
      while (i < n && !esSalto(contenido[i])) {
        resultado += " ";
        i += 1;
      }
      continue;
    }

    // Comentario de bloque: `/* ... */` (puede abarcar varias líneas).
    if (c === "/" && siguiente === "*") {
      resultado += "  ";
      i += 2;
      while (i < n && !(contenido[i] === "*" && contenido[i + 1] === "/")) {
        resultado += esSalto(contenido[i]) ? contenido[i] : " ";
        i += 1;
      }
      if (i < n) {
        resultado += "  ";
        i += 2;
      }
      continue;
    }

    // Literales de cadena y de plantilla: `"..."`, `'...'`, `` `...` ``.
    if (c === '"' || c === "'" || c === "`") {
      const comilla = c;
      resultado += " ";
      i += 1;
      while (i < n) {
        const actual = contenido[i];
        if (actual === "\\") {
          // Secuencia de escape: consume el carácter escapado.
          resultado += esSalto(actual) ? actual : " ";
          i += 1;
          if (i < n) {
            resultado += esSalto(contenido[i]) ? contenido[i] : " ";
            i += 1;
          }
          continue;
        }
        if (actual === comilla) {
          resultado += " ";
          i += 1;
          break;
        }
        resultado += esSalto(actual) ? actual : " ";
        i += 1;
      }
      continue;
    }

    resultado += c;
    i += 1;
  }

  return resultado;
}

/**
 * Detecta usos reales del tipo `any` en el código fuente de un archivo,
 * ignorando los que aparecen dentro de comentarios o literales de cadena.
 * Combina el preprocesado {@link eliminarComentariosYCadenas} con el detector
 * puro {@link detectarAny} de `./typing.ts`, preservando la línea 1-indexada.
 */
export function detectarAnyEnFuente(
  contenido: string,
  archivo: string,
): OcurrenciaTipado[] {
  return detectarAny(eliminarComentariosYCadenas(contenido), archivo);
}

/** Ocurrencia de `any` con el texto de la línea donde se encontró, para diagnóstico. */
interface OcurrenciaConContexto extends OcurrenciaTipado {
  /** Contenido de la línea original donde se detectó el `any`. */
  texto: string;
}

/**
 * Convierte una ruta absoluta a POSIX relativa a la raíz del proyecto.
 */
function aRutaRelativaPosix(rutaAbsoluta: string): string {
  return path.relative(RAIZ_PROYECTO, rutaAbsoluta).split(path.sep).join("/");
}

/**
 * Lee las entradas de un directorio, devolviendo una lista vacía si no puede
 * leerse para no interrumpir el recorrido.
 */
async function leerDirectorio(directorioAbsoluto: string): Promise<Dirent[]> {
  try {
    return await fs.readdir(directorioAbsoluto, { withFileTypes: true });
  } catch {
    return [];
  }
}

/**
 * Recorre recursivamente el árbol fuente activo acumulando los usos del tipo
 * `any`. Omite los directorios de {@link DIRECTORIOS_EXCLUIDOS} y los archivos
 * de la propia herramienta de auditoría.
 */
async function recorrer(
  directorioAbsoluto: string,
  ocurrencias: OcurrenciaConContexto[],
): Promise<void> {
  for (const entrada of await leerDirectorio(directorioAbsoluto)) {
    const rutaAbsoluta = path.join(directorioAbsoluto, entrada.name);
    if (entrada.isDirectory()) {
      if (!DIRECTORIOS_EXCLUIDOS.has(entrada.name)) {
        await recorrer(rutaAbsoluta, ocurrencias);
      }
      continue;
    }
    if (!entrada.isFile() || !EXTENSIONES_FUENTE.has(path.extname(entrada.name))) {
      continue;
    }

    const archivoPosix = aRutaRelativaPosix(rutaAbsoluta);
    if (ARCHIVOS_HERRAMIENTA_EXCLUIDOS.has(archivoPosix)) {
      continue;
    }

    let contenido: string;
    try {
      contenido = await fs.readFile(rutaAbsoluta, "utf8");
    } catch {
      continue;
    }
    if (contenido.includes("\uFFFD")) {
      continue; // No es texto válido (binario): se omite.
    }

    const lineas = contenido.split(/\r\n|\r|\n/);
    for (const ocurrencia of detectarAnyEnFuente(contenido, archivoPosix)) {
      ocurrencias.push({
        ...ocurrencia,
        texto: (lineas[ocurrencia.linea - 1] ?? "").trim(),
      });
    }
  }
}

describe("Feature: global-standardization-and-cleanup, Property 5: Ausencia del tipo `any` (árbol fuente activo)", () => {
  it("Validates: Requirements 9.2 — ningún `.ts`/`.tsx` activo usa el tipo `any`", async () => {
    const ocurrencias: OcurrenciaConContexto[] = [];
    await recorrer(RAIZ_PROYECTO, ocurrencias);

    ocurrencias.sort(
      (a, b) => a.archivo.localeCompare(b.archivo) || a.linea - b.linea,
    );

    const detalle = ocurrencias
      .map((o) => `${o.archivo}:${o.linea} → ${o.texto}`)
      .join("\n");
    expect(
      ocurrencias,
      `Usos del tipo \`any\` encontrados en el árbol fuente activo:\n${detalle}`,
    ).toEqual([]);
  });
});

describe("detectarAny — detecta usos reales del tipo `any` (detector puro reutilizado)", () => {
  it("detecta la anotación de tipo `: any`", () => {
    const ocurrencias = detectarAny("const dato: any = cargar();", "x.ts");
    expect(ocurrencias).toHaveLength(1);
    expect(ocurrencias[0]?.linea).toBe(1);
  });

  it("detecta la aserción `as any`", () => {
    const ocurrencias = detectarAny("const dato = valor as any;", "x.ts");
    expect(ocurrencias).toHaveLength(1);
  });

  it("detecta el genérico `<any>`", () => {
    const ocurrencias = detectarAny("const dato = cargar<any>();", "x.ts");
    expect(ocurrencias).toHaveLength(1);
  });

  it("detecta `any[]`, `Array<any>` y uniones `| any`", () => {
    const contenido = [
      "const a: any[] = [];",
      "const b: Array<any> = [];",
      "type C = string | any;",
    ].join("\n");
    const lineas = detectarAny(contenido, "x.ts").map((o) => o.linea);
    expect(lineas).toEqual([1, 2, 3]);
  });
});

describe("detectarAny — no produce falsos positivos por palabras que contienen `any`", () => {
  it("no coincide con `many`, `Company` ni `anyField` (palabra completa `\\bany\\b`)", () => {
    const contenido = [
      "const many: number = 3;",
      "interface Company { nombre: string }",
      "const anyField: string = obtener();",
      "function howMany(): number { return 0; }",
    ].join("\n");
    expect(detectarAny(contenido, "x.ts")).toEqual([]);
  });
});

describe("detectarAnyEnFuente — ignora `any` dentro de comentarios y cadenas", () => {
  it("no marca `any` escrito en un comentario de línea", () => {
    expect(
      detectarAnyEnFuente("const n: number = 1; // evitar any aquí", "x.ts"),
    ).toEqual([]);
  });

  it("no marca `any` escrito en un comentario de bloque multilínea", () => {
    const contenido = [
      "/**",
      " * No se usa `any` en este módulo.",
      " */",
      "const n: number = 1;",
    ].join("\n");
    expect(detectarAnyEnFuente(contenido, "x.ts")).toEqual([]);
  });

  it("no marca `any` escrito dentro de literales de cadena o plantilla", () => {
    const contenido = [
      'const mensaje = "no uses any";',
      "const otro = 'any como texto';",
      "const plantilla = `prohibido any`;",
    ].join("\n");
    expect(detectarAnyEnFuente(contenido, "x.ts")).toEqual([]);
  });

  it("sigue detectando un `any` real cuando convive con `any` en comentarios/cadenas", () => {
    const contenido = [
      "// este comentario menciona any",
      'const etiqueta = "any";',
      "const dato: any = cargar();",
    ].join("\n");
    const ocurrencias = detectarAnyEnFuente(contenido, "x.ts");
    expect(ocurrencias).toHaveLength(1);
    expect(ocurrencias[0]?.linea).toBe(3);
  });
});
