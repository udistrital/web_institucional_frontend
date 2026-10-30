import type { Metadata } from "next";
import FacultyPage from "../components/FacultyPage";
import { generateFacultyMetadata } from "../metadata";

const slug = "tecnologica";

export async function generateMetadata(): Promise<Metadata> {
  return generateFacultyMetadata(slug);
}

export default function TecnologicaPage() {
  return <FacultyPage slug={slug} />;
}
