import type { Metadata } from "next";
import { getFacultyBySlug } from "@/services/facultades";

const FALLBACK_TITLES: Record<string, string> = {
  "artes-asab": "Facultad de Artes ASAB",
  "ciencias-educacion": "Facultad de Ciencias y Educación",
  "ciencias-matematicas-naturales":
    "Facultad de Ciencias Matemáticas y Naturales",
  "ciencias-salud": "Facultad de Ciencias de la Salud",
  ingenieria: "Facultad de Ingeniería",
  "medio-ambiente-recursos-naturales":
    "Facultad de Medio Ambiente y Recursos Naturales",
  tecnologica: "Facultad Tecnológica",
};

function withFacultyPrefix(title: string): string {
  const normalizedTitle = title.trim();
  return /^facultad(?:\s|$)/i.test(normalizedTitle)
    ? normalizedTitle
    : `Facultad ${normalizedTitle}`;
}

export async function generateFacultyMetadata(slug: string): Promise<Metadata> {
  const faculty = await getFacultyBySlug(slug);
  const title = faculty?.title || FALLBACK_TITLES[slug] || "Facultad";

  return { title: withFacultyPrefix(title) };
}
