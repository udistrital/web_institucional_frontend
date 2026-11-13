/**
 * Textos introductorios de la sección "Oferta académica".
 *
 * Son PROVISIONALES: el contenido definitivo de cada facultad debe quedar
 * aquí, una entrada por slug de ruta (el mismo de `app/facultades/<slug>`).
 * Las facultades sin entrada propia usan el texto estándar.
 */

export type OfferIntroContext = {
  /** Nombre completo de la facultad, tal como lo entrega Drupal. */
  facultyTitle: string;
  /** Niveles disponibles en la facultad, ya ordenados. */
  levelNames: string[];
  /** Nombres de los programas, para la variante que muestra una tarjeta por programa. */
  programNames?: string[];
};

/** Enumera nombres en español: "a, b y c". */
export function listNames(names: string[]) {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];

  return `${names.slice(0, -1).join(", ")} y ${names[names.length - 1]}`;
}

type CopyTemplate = (context: OfferIntroContext) => string;

/** Texto estándar, temporal, para las facultades sin texto propio. */
const STANDARD: CopyTemplate = ({ facultyTitle, levelNames }) =>
  `La ${facultyTitle} ofrece programas de ${listNames(levelNames)}. Sus propuestas académicas combinan investigación, formación profesional y compromiso con el desarrollo del país, para formar profesionales capaces de transformar sus campos de trabajo.`;

/** Textos propios por slug de ruta de la facultad. */
const POR_FACULTAD: Record<string, CopyTemplate> = {
  "ciencias-matematicas-naturales": ({
    facultyTitle,
    levelNames,
    programNames,
  }) =>
    programNames?.length
      ? `La ${facultyTitle} ofrece los programas de ${listNames(programNames)}. Sus propuestas académicas integran el conocimiento científico, el pensamiento crítico y la formación profesional para responder a los desafíos del mundo contemporáneo.`
      : `La ${facultyTitle} ofrece programas de ${listNames(levelNames)}. Sus propuestas académicas integran el conocimiento científico, el pensamiento crítico y la formación profesional para responder a los desafíos del mundo contemporáneo.`,

  "ciencias-salud": ({ facultyTitle, levelNames, programNames }) =>
    programNames?.length
      ? `La ${facultyTitle} ofrece ${programNames.length === 1 ? "el programa" : "los programas"} de ${listNames(programNames)}, orientados al cuidado integral de las personas y las comunidades. La formación integra práctica clínica, investigación y servicio social, con un compromiso permanente con la salud pública y la transformación territorial.`
      : `La ${facultyTitle} ofrece programas de ${listNames(levelNames)} orientados al cuidado integral de las personas y las comunidades. La formación integra práctica clínica, investigación y servicio social, con un compromiso permanente con la salud pública y la transformación territorial.`,
};

/**
 * Devuelve el texto introductorio de la oferta académica de una facultad.
 * Si la facultad no tiene texto propio, se usa el estándar.
 */
export function getOfferIntro(
  facultyRouteSlug: string,
  context: OfferIntroContext,
): string {
  const template = POR_FACULTAD[facultyRouteSlug] ?? STANDARD;

  return template(context);
}
