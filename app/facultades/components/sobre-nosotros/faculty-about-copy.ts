/**
 * Textos de la sección "Sobre nosotros" de las páginas de facultad.
 *
 * Son PROVISIONALES: el contenido definitivo de cada facultad debe quedar
 * aquí, una entrada por slug de ruta (el mismo de `app/facultades/<slug>`).
 * Las facultades sin entrada propia usan el texto estándar.
 */

export type AboutCopy = {
  /** Párrafo principal. */
  description: string;
  /** Frase de enganche, opcional. Se destaca sobre el párrafo. */
  hook?: string;
};

const STANDARD: AboutCopy = {
  description:
    "La facultad trabaja en la formación integral de profesionales, la producción de conocimiento y la articulación con las necesidades de la sociedad. Desde sus programas académicos, promueve una educación pública de calidad, el pensamiento crítico y el compromiso con el desarrollo del país.",
};

/** Textos propios por slug de ruta de la facultad. */
const POR_FACULTAD: Record<string, AboutCopy> = {
  "ciencias-salud": {
    description:
      "La Facultad de Ciencias de la Salud ofrece el programa de Enfermería, una propuesta académica orientada a la formación de profesionales comprometidos con el cuidado integral de las personas y las comunidades. A través de una formación científica, humana y práctica, prepara profesionales capaces de responder a los principales desafíos de la salud pública y contribuir al bienestar de la sociedad.",
    hook:
      "Tu vocación por cuidar puede convertirse en una profesión que transforma vidas.",
  },
};

/** Devuelve el texto de "Sobre nosotros" de una facultad. */
export function getAboutCopy(facultyRouteSlug: string): AboutCopy {
  return POR_FACULTAD[facultyRouteSlug] ?? STANDARD;
}

/** Texto estándar, por si se necesita referenciarlo fuera del componente. */
export const ABOUT_STANDARD = STANDARD;
