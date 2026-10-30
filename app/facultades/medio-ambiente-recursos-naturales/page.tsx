import type { Metadata } from "next";
import FacultyPage from "../components/FacultyPage";
import { generateFacultyMetadata } from "../metadata";

const slug = "medio-ambiente-recursos-naturales";

export async function generateMetadata(): Promise<Metadata> {
  return generateFacultyMetadata(slug);
}

export default function MedioAmbienteRecursosNaturalesPage() {
  return <FacultyPage slug={slug} />;
}
