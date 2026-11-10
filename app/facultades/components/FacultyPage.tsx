import { cargarOfertaPorFacultad } from "@/services/oferta-academica";
import { getFacultyBySlug } from "@/services/facultades";
import { getFacultyBanners } from "@/services/hero";
import { getNews } from "@/services/noticias";
import { getEvents } from "@/services/eventos";
import { slugFiltro } from "@/lib/filtros";
import NewsSection from "@/components/common/news-section/news-section";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import PageHero from "@/components/common/page-hero";
import FacultyAcademicOffer, {
  type AcademicLevel,
  type FacultyAcademicData,
  type FacultyProgram,
} from "./FacultyAcademicOffer";
import FacultyBannerCarousel from "./FacultyBannerCarousel";
import FacultyContact from "./FacultyContact";
import FacultyHighlights from "./FacultyHighlights";
import FacultyQuickLinks from "./FacultyQuickLinks";
import getFacultyLockup from "./faculty-lockup";
import { getFacultyStats } from "./faculty-stats";
import styles from "./faculty-page.module.css";

type FacultyPageProps = {
  /**
   * Diseño del hero: "banners" (foto a la izquierda y carrusel a la derecha) o
   * "diagonal" (tarjeta blanca con logo y título, imagen a la derecha con corte
   * diagonal y sin banners).
   */
  heroStyle?: "banners" | "diagonal";
  /** Muestra los botones de secciones bajo el título (solo hero "diagonal"). */
  quickLinks?: boolean;
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

export default async function FacultyPage({
  heroStyle = "banners",
  quickLinks = false,
  slug,
}: FacultyPageProps) {
  const showBanners = heroStyle === "banners";

  const [faculty, news, events] = await Promise.all([
    getFacultyBySlug(slug),
    getNews(),
    getEvents(),
  ]);

  if (!faculty) {
    return (
      <section className={styles.page}>
        <div className={styles.body}>{unavailableMessage(
          "No fue posible encontrar esta facultad. Intenta de nuevo más tarde.",
        )}</div>
        <NewsSection news={news} events={events} />
      </section>
    );
  }

  const [offer, banners] = await Promise.all([
    cargarOfertaPorFacultad(faculty.title),
    // El hero diagonal no muestra banners: se evita la consulta a Drupal.
    showBanners ? getFacultyBanners(faculty.title) : Promise.resolve([]),
  ]);
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
  const { eyebrow, name } = getFacultyLockup(faculty.title);

  return (
    <section className={styles.page}>
      <PageHero
        aside={
          showBanners ? <FacultyBannerCarousel slides={banners} /> : undefined
        }
        belowTitle={
          quickLinks ? (
            <FacultyQuickLinks href={`/facultades/${slug}`} />
          ) : undefined
        }
        data={{
          eyebrow,
          title: name,
          titleHref: `/facultades/${slug}`,
          imageUrl: faculty.imageUrl,
          imageAlt: faculty.imageAlt,
        }}
        variant={showBanners ? "brand" : "brand-diagonal"}
      />

      <BreadCrumbs variant="faculty" />

      <FacultyHighlights
        // Si la oferta no cargó, se muestra "—" en lugar de un 0 engañoso.
        programCount={offer.noDisponible ? undefined : programs.length}
        stats={getFacultyStats(slug)}
      />

      <div className={styles.body}>
        <FacultyAcademicOffer
          faculty={facultyData}
          levels={levels}
          noDisponible={offer.noDisponible}
        />
      </div>

      <div aria-hidden="true" className={styles.newsTransition} />
      <NewsSection news={news} events={events} title={`Noticias`} />

      <FacultyContact attributes={faculty.attributes} title={faculty.title} />
    </section>
  );
}
