import type { Metadata } from "next";
import FacultyPage from "../components/FacultyPage";
import { generateFacultyMetadata } from "../metadata";

const slug = "ciencias-matematicas-naturales";

export async function generateMetadata(): Promise<Metadata> {
  return generateFacultyMetadata(slug);
}

export default function CienciasMatematicasNaturalesPage() {
  return <FacultyPage slug={slug} />;
}

