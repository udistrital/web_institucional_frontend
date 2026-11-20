import type { Metadata } from "next";
import { generateFacultyMetadata } from "../../metadata";

const FACULTY_SLUGS = [
  "artes-asab",
  "ciencias-educacion",
  "ciencias-matematicas-naturales",
  "ciencias-salud",
  "ingenieria",
  "medio-ambiente-recursos-naturales",
  "tecnologica",
] as const;

export const dynamicParams = false;

export async function generateStaticParams() {
  return FACULTY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const baseMeta = await generateFacultyMetadata(params.slug);
  return {
    ...baseMeta,
    title: `Procesos SIGUD - ${baseMeta.title || "Facultad"}`,
  };
}

export default function ProcesosSignudPage({
  params,
}: {
  params: { slug: string };
}) {
  return <div>Procesos SIGUD page placeholder for {params.slug}</div>;
}
