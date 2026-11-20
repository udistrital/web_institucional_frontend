import type { Metadata } from "next";
import { getFacultyBySlug } from "@/services/facultades";
import PageHero from "@/components/common/page-hero";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import SectionTabs from "@/components/common/section-tabs/section-tabs";
import { generateFacultyMetadata } from "../../metadata";
import { getFacultyNameForSigud, SECTIONS } from "./content";
import EmbedPanel from "./EmbedPanel";
import { getFacultyLockup } from "../../components/hero";
import FacultyQuickLinks from "../../components/hero/FacultyQuickLinks";
import styles from "./page.module.css";

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
  const facultyName = baseMeta.title || getFacultyNameForSigud(params.slug);
  return {
    ...baseMeta,
    title: `Procesos SIGUD - Facultad de ${facultyName}`,
  };
}

export default async function ProcesosSignudPage({
  params,
}: {
  params: { slug: string };
}) {
  const faculty = await getFacultyBySlug(params.slug);
  
  if (!faculty) {
    return (
      <div className={styles.page}>
        <h1>Facultad no disponible</h1>
        <p>No fue posible cargar los datos de la facultad.</p>
      </div>
    );
  }

  const { eyebrow, name } = getFacultyLockup(faculty.title);

  // Create section links for SectionTabs
  const sectionLinks = SECTIONS.map((section) => ({
    id: section.id,
    label: section.label,
  }));

  // Create panels for each section
  const panels = SECTIONS.reduce(
    (acc, section) => {
      acc[section.id] = (
        <EmbedPanel
          key={section.id}
          id={section.id}
          title={section.title}
          url={section.url}
          embeddable={section.embeddable}
        />
      );
      return acc;
    },
    {} as Record<string, React.ReactNode>
  );

  return (
    <>
      <PageHero
        data={{
          eyebrow,
          title: name,
          titleHref: `/facultades/${params.slug}`,
          imageUrl: faculty.imageUrl,
          imageAlt: faculty.imageAlt,
        }}
        variant="brand-diagonal"
      />

      <BreadCrumbs variant="onDark" />

      <FacultyQuickLinks slug={params.slug} activeId="procesos-sigud" />

      <div className={styles.page}>
        <SectionTabs
          sections={sectionLinks}
          panels={panels}
          ariaLabel="Secciones de Procesos SIGUD"
          contentClassName={styles.tabContent}
        />
      </div>
    </>
  );
}
