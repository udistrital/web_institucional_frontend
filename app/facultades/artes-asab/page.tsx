import type { Metadata } from "next";
import FacultyPage from "../components/FacultyPage";
import { generateFacultyMetadata } from "../metadata";

const slug = "artes-asab";

export async function generateMetadata(): Promise<Metadata> {
  return generateFacultyMetadata(slug);
}

export default function ArtesAsabPage() {
  return <FacultyPage slug={slug} />;
}
