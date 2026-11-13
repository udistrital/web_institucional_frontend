export type FacultyStats = {
  estudiantes?: string;
  gruposInvestigacion?: string;
  docentes?: string;
};

/**
 * Cifras por facultad (slug de la ruta). DATOS DE EJEMPLO: son valores
 * temporales hasta que Drupal exponga las cifras reales. "Programas" no se
 * configura aquí: se calcula con la oferta académica de la facultad.
 */
const FACULTY_STATS: Record<string, FacultyStats> = {
  "artes-asab": { estudiantes: "+0000", gruposInvestigacion: "00", docentes: "+0000" },
  "ciencias-educacion": { estudiantes: "+0000", gruposInvestigacion: "00", docentes: "+0000" },
  "ciencias-matematicas-naturales": { estudiantes: "+0000", gruposInvestigacion: "00", docentes: "+0000" },
  "ciencias-salud": { estudiantes: "+0000", gruposInvestigacion: "00", docentes: "+0000" },
  ingenieria: { estudiantes: "+0000", gruposInvestigacion: "00", docentes: "+0000" },
  "medio-ambiente-recursos-naturales": { estudiantes: "+0000", gruposInvestigacion: "00", docentes: "+0000" },
  tecnologica: { estudiantes: "+0000", gruposInvestigacion: "00", docentes: "+0000" },
};

export function getFacultyStats(slug: string): FacultyStats | undefined {
  return FACULTY_STATS[slug];
}
