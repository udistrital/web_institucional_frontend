import Image from "next/image";
import { cargarOfertaAcademica } from "@/services/oferta-academica";
import { getFacultyBySlug } from "@/services/facultades";
import { getNews } from "@/services/noticias";
import { slugFiltro } from "@/lib/filtros";
import NewsSection from "@/components/common/news-section/news-section";
import FacultyAcademicOffer, {
  type AcademicLevel,
  type FacultyAcademicData,
  type FacultyProgram,
} from "./FacultyAcademicOffer";
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
  program: Awaited<ReturnType<typeof cargarOfertaAcademica>>["programas"][number],
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
  const [faculty, offer, news] = await Promise.all([
    getFacultyBySlug(slug),
    cargarOfertaAcademica(),
    getNews(),
  ]);

  if (!faculty) {
    return (
      <main className={styles.page}>
        <div className={styles.body}>{unavailableMessage(
          "No fue posible encontrar esta facultad. Intenta de nuevo más tarde.",
        )}</div>
        <NewsSection news={news} />
      </main>
    );
  }

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

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Oferta académica por sede</p>
          <h1 className={styles.heroTitle}>Facultad {faculty.title}</h1>
          <p className={styles.heroLead}>
            Conoce los programas académicos y niveles de formación de esta
            facultad.
          </p>
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

      <div className={styles.body}>
        <FacultyAcademicOffer
          faculty={facultyData}
          levels={levels}
          noDisponible={offer.noDisponible}
        />
      </div>

      <NewsSection news={news} />
    </main>
  );
}
