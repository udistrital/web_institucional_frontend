import type { Metadata } from "next";
import FacultyPage from "../components/FacultyPage";
import { generateFacultyMetadata } from "../metadata";

const slug = "ingenieria";

export async function generateMetadata(): Promise<Metadata> {
  return generateFacultyMetadata(slug);
}

export default function IngenieriaPage() {
  return <FacultyPage slug={slug} />;
}
