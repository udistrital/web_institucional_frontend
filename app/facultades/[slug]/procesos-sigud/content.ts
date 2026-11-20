export type SigudSection = {
  id: string;
  label: string;
  title: string;
  url: string;
  embeddable: boolean;
};

export const SECTIONS: SigudSection[] = [
  {
    id: "admisiones",
    label: "Admisiones",
    title: "Admisiones, Registro y Control",
    url: "https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=939",
    embeddable: true,
  },
  {
    id: "docencia",
    label: "Docencia",
    title: "Gestión de Docencia",
    url: "https://udistrital.darumasoftware.com/app.php/staff/document/viewPublic?index=946",
    embeddable: true,
  },
  {
    id: "laboratorios",
    label: "Laboratorios",
    title: "Gestión de Laboratorios",
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
