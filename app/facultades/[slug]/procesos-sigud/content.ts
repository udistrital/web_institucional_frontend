export type SigudSection = {
  id: string;
  /** Nombre del documento: se usa en la pestaña, el título del panel y el iframe. */
  label: string;
  url: string;
  /**
   * `true` muestra el documento en un iframe; `false` muestra una tarjeta con
   * el enlace para abrirlo en una pestaña nueva.
   *
   * Daruma responde con `Content-Security-Policy: frame-ancestors 'self'
   * planeacionud.udistrital.edu.co` y `X-Frame-Options: SAMEORIGIN`, así que
   * los navegadores bloquean el iframe desde cualquier otro dominio. El visor
   * solo mostrará el documento si el dominio del sitio está autorizado en
   * Daruma; mientras tanto el enlace "Abrir en una pestaña nueva" siempre
   * está visible. Poner `false` para mostrar solo la tarjeta con el enlace.
   */
  embeddable: boolean;
};

export const SECTIONS: SigudSection[] = [
  {
    id: "admisiones-registro-control",
    label: "Admisiones, Registro y Control",
    url: "https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=939",
    embeddable: true,
  },
  {
    id: "gestion-docencia",
    label: "Gestión de Docencia",
    url: "https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=946",
    embeddable: true,
  },
  {
    id: "gestion-laboratorios",
    label: "Gestión de laboratorios",
    url: "https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=950",
    embeddable: true,
  },
];

export function getFacultyNameForSigud(slug: string): string {
  const FALLBACK_TITLES: Record<string, string> = {
    "artes-asab": "Artes ASAB",
    "ciencias-educacion": "Ciencias y Educación",
    "ciencias-matematicas-naturales": "Ciencias Matemáticas y Naturales",
    "ciencias-salud": "Ciencias de la Salud",
    ingenieria: "Ingeniería",
    "medio-ambiente-recursos-naturales": "Medio Ambiente y Recursos Naturales",
    tecnologica: "Tecnológica",
  };
  return FALLBACK_TITLES[slug] || "Facultad";
}
