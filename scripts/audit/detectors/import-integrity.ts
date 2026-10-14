/**
 * Detector de referencias a rutas/nombres ANTIGUOS (pre-estandarización) que
 * fueron renombrados durante la Fase 3 de la feature
 * `global-standardization-and-cleanup`.
 *
 * Feature: global-standardization-and-cleanup, Property 2: Integridad de
 * importaciones tras renombrar.
 *
 * Validates: Requirements 3.5, 4.5.
 *
 * Tras la estandarización estructural (barrels + `[Nombre].tsx` PascalCase), el
 * árbol fuente activo NO debe contener ninguna referencia de importación a los
 * especificadores de módulo antiguos. Los nombres antiguos eran kebab/flat en
 * minúsculas; los nuevos son PascalCase. Por eso el matching es
 * **case-SENSITIVE**: `header/Header` (nuevo) NO debe coincidir con
 * `header/header` (antiguo).
 *
 * Diseño: función **pura** sobre texto. No lee del sistema de archivos; recibe
 * el contenido y la ruta del archivo y devuelve una ocurrencia por cada
 * coincidencia, con el número de línea 1-indexado.
 *
 * Cada patrón ancla la coincidencia a un **especificador de módulo** real:
 * - Alias de proyecto `@/<ruta>` o ruta relativa (`./`, `../`).
 * - Un límite derecho que impide extender el nombre antiguo hasta el nuevo
 *   nombre PascalCase (p. ej. que `header/header` no coincida dentro de
 *   `header/HeaderX`), y que evita confundir el nombre del componente con el
 *   del módulo CSS homónimo (`footer/footer.module.css` NO es `footer/footer`).
 *
 * Esto evita falsos positivos sobre:
 * - Los nuevos barrels/archivos PascalCase (`header/Header`, `main-menu/MainMenu`,
 *   `audience-nav/AudienceNav`, `audience-nav/AudienceButton`,
 *   `footer/Footer`, `contact-widget/ContactWidget`, `tarjet/Tarjet`,
 *   `emisoraLive/EmisoraLive`).
 * - Los módulos CSS conservados (`footer/footer.module.css`,
 *   `tarjet/tarjet.module.css`, `contact-widget/contact-widget.module.css`,
 *   `emisoraLive/emisoraLive.module.css`, `main-menu/main-menu.module.css`,
 *   `audience-nav/audience-nav.module.css`).
 */

/**
 * Clase de artefacto antiguo (ruta/nombre renombrado) al que apunta una
 * referencia detectada.
 */
export type ClaseImportacionAntigua =
  | "components/header/header"
  | "components/header/brand"
  | "components/footer/footer"
  | "components/contact-widget/contact-widget"
  | "components/tarjet/tarjet"
  | "components/emisoraLive/emisora-live"
  | "components/ti/TablerosExplorer (default import)"
  | "main-menu/main-menu"
  | "mani-menu.module"
  | "audience-nav/audience-nav"
  | "audience-nav/audience-button";

/**
 * Una referencia a una ruta/nombre antiguo detectada en un archivo, con su
 * ubicación exacta (archivo + línea 1-indexada) y la clase de artefacto.
 */
export interface OcurrenciaImportacionAntigua {
  /** Ruta del archivo donde se detectó, relativa a la raíz del proyecto. */
  archivo: string;
  /** Número de línea de la ocurrencia (1-indexado). */
  linea: number;
  /** Ruta/nombre antiguo al que apunta la referencia. */
  clase: ClaseImportacionAntigua;
  /** Texto exacto de la coincidencia, para diagnóstico. */
  coincidencia: string;
}

/** Patrón de detección: expresión regular global asociada a su clase. */
interface PatronImportacionAntigua {
  /** Clase de artefacto antiguo que produce el patrón. */
  clase: ClaseImportacionAntigua;
  /** Expresión regular global que localiza la referencia en una línea. */
  expresion: RegExp;
}

/**
 * Prefijo que ancla una coincidencia a un especificador de módulo: alias de
 * proyecto `@/<ruta>` o ruta relativa (uno o más `./` o `../`). Se exige
 * SIEMPRE antes del nombre antiguo para que una subcadena suelta no coincida.
 */
const PREFIJO_MODULO = String.raw`(?:@\/|(?:\.\.?\/)+)`;

/**
 * Límite derecho de un nombre de módulo "hoja" (sin más subrutas de archivo).
 * Impide que el nombre antiguo en minúsculas se extienda hacia el nuevo nombre
 * PascalCase y evita confundirlo con su módulo CSS homónimo:
 *   - Fin de cadena o un carácter que cierra el especificador (comilla, `)`).
 *   - Extensión de archivo del propio módulo (`.ts`/`.tsx`), opcional.
 * NO admite `.module` ni un carácter alfanumérico adicional, de modo que
 * `footer/footer.module.css` o `header/HeaderX` no coincidan.
 */
const LIMITE_HOJA = String.raw`(?:\.tsx?)?(?=["'\`)]|$)`;

/**
 * Patrones de rutas/nombres antiguos. El matching es case-sensitive (sin flag
 * `i`): los nuevos nombres PascalCase quedan fuera por construcción.
 */
const PATRONES: readonly PatronImportacionAntigua[] = [
  // Antiguo header plano `components/header/header` → nuevo `header/Header`.
  {
    clase: "components/header/header",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}components\/header\/header${LIMITE_HOJA}`,
      "g",
    ),
  },
  // Antiguo `components/header/brand` → nuevo `header/Brand`.
  {
    clase: "components/header/brand",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}components\/header\/brand${LIMITE_HOJA}`,
      "g",
    ),
  },
  // Antiguo `components/footer/footer` → nuevo `footer/Footer`. El límite evita
  // coincidir con `footer/footer.module.css`.
  {
    clase: "components/footer/footer",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}components\/footer\/footer${LIMITE_HOJA}`,
      "g",
    ),
  },
  // Antiguo `components/contact-widget/contact-widget` → `contact-widget/ContactWidget`.
  {
    clase: "components/contact-widget/contact-widget",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}components\/contact-widget\/contact-widget${LIMITE_HOJA}`,
      "g",
    ),
  },
  // Antiguo `components/tarjet/tarjet` → nuevo `tarjet/Tarjet`.
  {
    clase: "components/tarjet/tarjet",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}components\/tarjet\/tarjet${LIMITE_HOJA}`,
      "g",
    ),
  },
  // Antiguo kebab `components/emisoraLive/emisora-live` → `emisoraLive/EmisoraLive`.
  {
    clase: "components/emisoraLive/emisora-live",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}components\/emisoraLive\/emisora-live${LIMITE_HOJA}`,
      "g",
    ),
  },
  // Antiguo nombre de archivo CSS con typo `mani-menu.module` → `main-menu.module`.
  {
    clase: "mani-menu.module",
    expresion: new RegExp(String.raw`mani-menu\.module`, "g"),
  },
  // Antiguo contenedor `main-menu/main-menu` → nuevo `main-menu/MainMenu`.
  // Permite subruta de archivo opcional del antiguo módulo plano.
  {
    clase: "main-menu/main-menu",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}(?:components\/header\/)?main-menu\/main-menu${LIMITE_HOJA}`,
      "g",
    ),
  },
  // Antiguo `audience-nav/audience-nav` → nuevo `audience-nav/AudienceNav`.
  {
    clase: "audience-nav/audience-nav",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}(?:components\/header\/)?audience-nav\/audience-nav${LIMITE_HOJA}`,
      "g",
    ),
  },
  // Antiguo `audience-nav/audience-button` → nuevo `audience-nav/AudienceButton`.
  {
    clase: "audience-nav/audience-button",
    expresion: new RegExp(
      String.raw`${PREFIJO_MODULO}(?:components\/header\/)?audience-nav\/audience-button${LIMITE_HOJA}`,
      "g",
    ),
  },
];

/**
 * Patrón especial: importación POR DEFECTO del antiguo `TablerosExplorer`.
 *
 * La ruta `components/ti/TablerosExplorer` sigue existiendo, pero ahora se
 * consume como importación NOMBRADA (`import { TablerosExplorer } from ...`).
 * La forma antigua era una importación por defecto
 * (`import TablerosExplorer from ".../ti/TablerosExplorer"`). Este patrón
 * detecta únicamente la forma de importación por defecto (sin llaves) para no
 * marcar como falso positivo las importaciones nombradas vigentes.
 *
 * Grupo 1 = nombre del binding por defecto (identificador, no `{`).
 */
const PATRON_TI_DEFAULT = new RegExp(
  String.raw`\bimport\s+([A-Za-z_$][\w$]*)\s*(?:,\s*\{[^}]*\})?\s*from\s*["'\`]${PREFIJO_MODULO}components\/ti\/TablerosExplorer(?:\.tsx?)?["'\`]`,
  "g",
);

/**
 * Divide el contenido en líneas conservando la correspondencia 1-indexada.
 * Admite `\n`, `\r\n` y `\r`.
 */
function dividirEnLineas(contenido: string): string[] {
  return contenido.split(/\r\n|\r|\n/);
}

/**
 * Detecta referencias a rutas/nombres ANTIGUOS en el contenido de un archivo.
 *
 * Función pura: no accede al sistema de archivos. Recorre el contenido línea a
 * línea y emite una ocurrencia por cada coincidencia, con la línea 1-indexada.
 * Devuelve un arreglo vacío cuando no hay ninguna referencia.
 *
 * @param contenido Contenido textual del archivo a analizar.
 * @param archivo Ruta del archivo (relativa a la raíz del proyecto).
 * @returns Ocurrencias detectadas, ordenadas por línea y, dentro de una línea,
 *   por posición de inicio.
 */
export function detectarImportacionesAntiguas(
  contenido: string,
  archivo: string,
): OcurrenciaImportacionAntigua[] {
  const ocurrencias: OcurrenciaImportacionAntigua[] = [];
  const lineas = dividirEnLineas(contenido);

  lineas.forEach((linea, indice) => {
    const numeroLinea = indice + 1;
    const enLinea: Array<OcurrenciaImportacionAntigua & { inicio: number }> = [];

    for (const patron of PATRONES) {
      const expresion = new RegExp(patron.expresion.source, patron.expresion.flags);
      for (const coincidencia of linea.matchAll(expresion)) {
        enLinea.push({
          archivo,
          linea: numeroLinea,
          clase: patron.clase,
          coincidencia: coincidencia[0],
          inicio: coincidencia.index ?? 0,
        });
      }
    }

    // Importación por defecto del antiguo TablerosExplorer.
    for (const coincidencia of linea.matchAll(
      new RegExp(PATRON_TI_DEFAULT.source, PATRON_TI_DEFAULT.flags),
    )) {
      enLinea.push({
        archivo,
        linea: numeroLinea,
        clase: "components/ti/TablerosExplorer (default import)",
        coincidencia: coincidencia[0],
        inicio: coincidencia.index ?? 0,
      });
    }

    enLinea.sort((a, b) => a.inicio - b.inicio);
    for (const ocurrencia of enLinea) {
      ocurrencias.push({
        archivo: ocurrencia.archivo,
        linea: ocurrencia.linea,
        clase: ocurrencia.clase,
        coincidencia: ocurrencia.coincidencia,
      });
    }
  });

  return ocurrencias;
}

/**
 * Indica si el contenido de un archivo contiene al menos una referencia a una
 * ruta/nombre antiguo. Detector booleano de conveniencia.
 */
export function contieneImportacionAntigua(contenido: string): boolean {
  return detectarImportacionesAntiguas(contenido, "").length > 0;
}
