import Image from "next/image";
import { cargarOfertaPorFacultad } from "@/services/oferta-academica";
import { getFacultyBySlug } from "@/services/facultades";
import { getNews } from "@/services/noticias";
import { slugFiltro } from "@/lib/filtros";
import NewsSection from "@/components/common/news-section/news-section";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import FacultyAcademicOffer, {
  type AcademicLevel,
  type FacultyAcademicData,
  type FacultyProgram,
} from "./FacultyAcademicOffer";
import getFacultyHeadingSegments from "./faculty-heading";
import styles from "./faculty-page.module.css";

type FacultyPageProps = {
  slug: string;
};

const LEVEL_ORDER = ["pregrado", "especializacion", "maestria", "doctorado"];

function groupProgramsByLevel(programs: FacultyProgram[]): AcademicLevel[] {
  const levels = new Map<string, AcademicLevel>();

  for (const program of programs) {
    const name = program.nivel || "";
    const key = slugFiltro(name);
    if (!key) continue;

    const level = levels.get(key);
    if (level) {
      level.programs.push(program);
    } else {
      levels.set(key, { name, programs: [program] });
    }
  }

  return [...levels.values()].sort((a, b) => {
    const orderA = LEVEL_ORDER.indexOf(slugFiltro(a.name));
    const orderB = LEVEL_ORDER.indexOf(slugFiltro(b.name));
    const rankA = orderA === -1 ? LEVEL_ORDER.length : orderA;
    const rankB = orderB === -1 ? LEVEL_ORDER.length : orderB;

    return rankA - rankB || a.name.localeCompare(b.name, "es");
  });
}

function serializeProgram(
  program: Awaited<ReturnType<typeof cargarOfertaPorFacultad>>["programas"][number],
): FacultyProgram {
  return {
    id: program.id,
    nombre: program.nombre,
    nivel: program.nivelFiltro || program.nivel,
    modalidad: program.modalidad,
    jornada: program.jornada,
    snies: program.snies,
    acreditacionAltaCalidad: program.acreditacionAltaCalidad,
    imagenUrl: program.imagenUrl,
    imagenAlt: program.imagenAlt,
    paginaProgramaUrl: program.paginaProgramaUrl,
  };
}

function unavailableMessage(message: string) {
  return (
    <div className={styles.unavailable} role="alert">
      <h1>Facultad no disponible</h1>
      <p>{message}</p>
    </div>
  );
}

export default async function FacultyPage({ slug }: FacultyPageProps) {
  const [faculty, news] = await Promise.all([
    getFacultyBySlug(slug),
    getNews(),
  ]);

  if (!faculty) {
    return (
      <section className={styles.page}>
        <div className={styles.body}>{unavailableMessage(
          "No fue posible encontrar esta facultad. Intenta de nuevo más tarde.",
        )}</div>
        <NewsSection news={news} />
      </section>
    );
  }

  const offer = await cargarOfertaPorFacultad(faculty.title);
  const facultySlug = slugFiltro(faculty.title);
  const programs = offer.programas
    .filter((program) => slugFiltro(program.facultad) === facultySlug)
    .map(serializeProgram);
  const levels = groupProgramsByLevel(programs);
  const facultyData: FacultyAcademicData = {
    title: faculty.title,
    imageUrl: faculty.imageUrl,
    imageAlt: faculty.imageAlt,
  };
  const headingSegments = getFacultyHeadingSegments(faculty.title);
  const headingText = headingSegments.map((segment) => segment.text).join("");

  return (
    <section className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>
            {headingSegments.map((segment, index) => (
              <span
                className={segment.accent ? styles.heroTitleAccent : undefined}
                key={`${segment.text}-${index}`}
              >
                {segment.text}
              </span>
            ))}
          </h1>
        </div>
        <div className={styles.heroVisual}>
          {faculty.imageUrl ? (
            <Image
              alt={faculty.imageAlt}
              className={styles.heroImage}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 42vw"
              src={faculty.imageUrl}
            />
          ) : (
            <div
              aria-label={`Imagen no disponible de ${faculty.title}`}
              className={styles.heroImageFallback}
              role="img"
            >
              <span aria-hidden="true">{faculty.title.charAt(0)}</span>
            </div>
          )}
          <span aria-hidden="true" className={styles.heroAccent} />
        </div>
      </header>

      <BreadCrumbs variant="faculty" />

      <div className={styles.body}>
        <FacultyAcademicOffer
          faculty={facultyData}
          levels={levels}
          noDisponible={offer.noDisponible}
        />
      </div>

      <div aria-hidden="true" className={styles.newsTransition} />
      <NewsSection news={news} title={`Noticias · ${headingText}`} />
    </section>
  );
}
