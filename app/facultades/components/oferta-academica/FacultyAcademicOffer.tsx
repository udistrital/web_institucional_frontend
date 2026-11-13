import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/button/button";
import { slugFiltro } from "@/lib/filtros";
import { getOfferIntro } from "./faculty-offer-copy";
import styles from "./faculty-academic-offer.module.css";

export type FacultyAcademicData = {
  title: string;
  imageUrl: string | null;
  imageAlt: string;
};

export type FacultyProgram = {
  id: string;
  nombre: string;
  nivel: string | null;
  modalidad: string | null;
  jornada: string | null;
  snies: number | null;
  acreditacionAltaCalidad: boolean;
  imagenUrl: string | null;
  imagenAlt: string;
  paginaProgramaUrl: string | null;
};

export type AcademicLevel = {
  name: string;
  programs: FacultyProgram[];
};

type FacultyAcademicOfferProps = {
  faculty: FacultyAcademicData;
  levels: AcademicLevel[];
  noDisponible: boolean;
  /**
   * Muestra una tarjeta por programa en lugar de una por nivel. Se usa en
   * facultades con pocos programas, donde conviene nombrarlos uno a uno.
   */
  showProgramCards?: boolean;
  /** Programas de la facultad, en el orden en que llegan de la oferta. */
  programs?: FacultyProgram[];
  /** Slug de la ruta de la facultad: define el texto introductorio. */
  facultyRouteSlug?: string;
};

function levelImage(level: AcademicLevel, faculty: FacultyAcademicData) {
  return level.programs[0]?.imagenUrl || faculty.imageUrl;
}

export default function FacultyAcademicOffer({
  faculty,
  facultyRouteSlug = "",
  levels,
  noDisponible,
  programs = [],
  showProgramCards = false,
}: FacultyAcademicOfferProps) {
  const facultySlug = slugFiltro(faculty.title);
  const hasPostgraduate = levels.some((level) =>
    ["especializacion", "maestria", "doctorado"].includes(
      slugFiltro(level.name),
    ),
  );
  const useProgramCards = showProgramCards && !hasPostgraduate;

  if (noDisponible) {
    return (
      <section className={styles.offer} aria-labelledby="faculty-offer-title">
        <div className={styles.statusMessage} role="alert">
          <h2 id="faculty-offer-title">Oferta académica no disponible</h2>
          <p>
            No fue posible consultar los programas en este momento. Intenta de
            nuevo más tarde.
          </p>
        </div>
      </section>
    );
  }

  if (levels.length === 0) {
    return (
      <section className={styles.offer} aria-labelledby="faculty-offer-title">
        <div className={styles.statusMessage} role="status">
          <h2 id="faculty-offer-title">Oferta académica</h2>
          <p>Esta facultad no tiene programas académicos publicados.</p>
        </div>
      </section>
    );
  }

  if (useProgramCards && facultyRouteSlug === "ciencias-salud") {
    const program = programs[0];
    const imageUrl = program?.imagenUrl || faculty.imageUrl;
    const href = program?.paginaProgramaUrl ?? `/oferta-academica?facultad=${facultySlug}`;

    return (
      <section className={`${styles.offer} ${styles.healthOffer}`} aria-labelledby="faculty-offer-title">
        <div className={styles.healthOfferCopy}>
          <div className={styles.offerTextPanel}>
            <div className={styles.offerHeading}>
              <h2 id="faculty-offer-title">Oferta académica</h2>
            </div>
            <p className={styles.offerIntro}>
              La Facultad de Ciencias de la Salud ofrece el programa de Enfermería,
              una formación integral para profesionales comprometidos con el cuidado
              de las personas y las comunidades.
            </p>
            <p className={styles.offerHook}>
              Tu vocación por cuidar puede convertirse en una profesión que transforma vidas.
            </p>
          </div>
        </div>
        <Link className={styles.healthProgramCard} href={href}>
          <div className={styles.healthProgramMedia}>
            {imageUrl ? (
              <Image
                alt={program?.imagenUrl ? program.imagenAlt : faculty.imageAlt}
                className={styles.levelImage}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                src={imageUrl}
              />
            ) : (
              <span aria-hidden="true" className={styles.levelFallback}>E</span>
            )}
            <span aria-hidden="true" className={styles.levelScrim} />
            <span className={styles.levelButton}>Enfermería</span>
          </div>
        </Link>
        <div className={styles.enrollmentAction}>
          <Button href="/perfiles/aspirantes/#tramites" variant="red">
            Procesos de inscripción
          </Button>
        </div>
      </section>
    );
  }

  if (useProgramCards) {
    const programNames = programs.map((program) => program.nombre);
    const intro = getOfferIntro(facultyRouteSlug, {
      facultyTitle: faculty.title,
      levelNames: levels.map((level) => level.name),
      programNames,
    });

    return (
      <section className={styles.offer} aria-labelledby="faculty-offer-title">
        <div className={styles.offerTextPanel}>
          <div className={styles.offerHeading}>
            <h2 id="faculty-offer-title">Oferta académica</h2>
          </div>

          {programNames.length > 0 && (
            <p className={styles.offerIntro}>{intro}</p>
          )}
        </div>

        <div className={styles.levelGrid}>
          {programs.map((program) => {
            const imageUrl = program.imagenUrl || faculty.imageUrl;
            const href =
              program.paginaProgramaUrl ??
              `/oferta-academica?facultad=${facultySlug}`;

            return (
              <Link
                className={styles.levelCard}
                href={href}
                key={program.id}
              >
                <div className={styles.levelMedia}>
                  {imageUrl ? (
                    <Image
                      alt={
                        program.imagenUrl
                          ? program.imagenAlt
                          : faculty.imageAlt
                      }
                      className={styles.levelImage}
                      fill
                      sizes="248px"
                      src={imageUrl}
                    />
                  ) : (
                    <span aria-hidden="true" className={styles.levelFallback}>
                      {program.nombre.charAt(0)}
                    </span>
                  )}
                  <span aria-hidden="true" className={styles.levelScrim} />
                  <span className={styles.levelButton}>{program.nombre}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className={styles.enrollmentAction}>
          <Button href="/perfiles/aspirantes/#tramites" variant="red">
            Procesos de inscripci&oacute;n
          </Button>
        </div>
      </section>
    );
  }

  const intro = getOfferIntro(facultyRouteSlug, {
    facultyTitle: faculty.title,
    levelNames: levels.map((level) => level.name),
  });

  return (
    <section className={styles.offer} aria-labelledby="faculty-offer-title">
      <div className={styles.offerTextPanel}>
        <div className={styles.offerHeading}>
          <h2 id="faculty-offer-title">Oferta académica</h2>
        </div>

        {intro && <p className={styles.offerIntro}>{intro}</p>}
      </div>

      <div className={styles.levelGrid}>
        {levels.map((level) => {
          const imageUrl = levelImage(level, faculty);
          const levelSlug = slugFiltro(level.name);
          const href = `/oferta-academica?facultad=${facultySlug}&nivel=${levelSlug}`;

          return (
            <Link
              className={styles.levelCard}
              href={href}
              key={level.name}
            >
              <div className={styles.levelMedia}>
                {imageUrl ? (
                  <Image
                    alt={level.programs[0]?.imagenUrl
                      ? level.programs[0].imagenAlt
                      : faculty.imageAlt}
                    className={styles.levelImage}
                    fill
                    sizes="248px"
                    src={imageUrl}
                  />
                ) : (
                  <span aria-hidden="true" className={styles.levelFallback}>
                    {level.name.charAt(0)}
                  </span>
                )}
                <span aria-hidden="true" className={styles.levelScrim} />
                <span className={styles.levelButton}>{level.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className={styles.enrollmentAction}>
        <Button href="/perfiles/aspirantes/#tramites" variant="red">
          Procesos de inscripción
        </Button>
      </div>
    </section>
  );
}
