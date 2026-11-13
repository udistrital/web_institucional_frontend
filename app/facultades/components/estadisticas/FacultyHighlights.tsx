import Image from "next/image";
import type { FacultyStats } from "./faculty-stats";
import FacultyVideo from "./FacultyVideo";
import styles from "./faculty-highlights.module.css";

type FacultyHighlightsProps = {
  /** Total de programas de la facultad; `undefined` si la oferta no cargó. */
  programCount?: number;
  stats?: FacultyStats;
  /** Imagen del hero de la sede, usada como fondo decorativo. */
  backgroundImageUrl?: string | null;
};

type StatIconName = "students" | "programs" | "research" | "teachers";

function StatIcon({ name }: { name: StatIconName }) {
  const paths = {
    students: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    programs: (
      <>
        <rect height="14" rx="1" width="20" x="2" y="3" />
        <path d="M8 21h8M12 17v4" />
      </>
    ),
    research: (
      <>
        <path d="m14.5 4.5 5 5M13 6l-3 3M19 3l2 2" />
        <path d="m11 8-7 7a2.83 2.83 0 1 0 4 4l7-7" />
        <path d="m15 12 4 4M4 21h16" />
      </>
    ),
    teachers: (
      <>
        <path d="M3 7h18v13H3zM7 7V4h10v3M3 11h18M9 15h6" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      className={styles.statIcon}
      fill="none"
      focusable="false"
      viewBox="0 0 24 24"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75">
        {paths[name]}
      </g>
    </svg>
  );
}

function StatValue({ value }: { value?: number | string }) {
  if (value === undefined || value === "") {
    return (
      <>
        <span aria-hidden="true">—</span>
        <span className="sr-only">Sin dato</span>
      </>
    );
  }

  return value;
}

export default function FacultyHighlights({
  backgroundImageUrl,
  programCount,
  stats,
}: FacultyHighlightsProps) {
  const items = [
    { icon: "students" as const, label: "Estudiantes", value: stats?.estudiantes },
    { icon: "programs" as const, label: "Programas", value: programCount },
    {
      icon: "research" as const,
      label: "Grupos de investigación",
      value: stats?.gruposInvestigacion,
    },
    { icon: "teachers" as const, label: "Docentes", value: stats?.docentes },
  ];

  return (
    <section aria-labelledby="facultad-cifras" className={styles.highlights}>
      <div className={styles.inner}>
        <div className={styles.stats}>
          {backgroundImageUrl && (
            <Image
              alt=""
              aria-hidden="true"
              className={styles.statsBgImage}
              fill
              sizes="(max-width: 1023px) 100vw, 60vw"
              src={backgroundImageUrl}
            />
          )}
          <span aria-hidden="true" className={styles.statsOverlay} />
          <h2 className="sr-only" id="facultad-cifras">
            Facultad en cifras
          </h2>
          <dl className={styles.statList}>
            {items.map((item) => (
              <div className={styles.stat} key={item.label}>
                <dt className={styles.statLabel}>{item.label}</dt>
                <dd className={styles.statValue}>
                  <StatValue value={item.value} />
                </dd>
                <span className={styles.statIconWrap}>
                  <StatIcon name={item.icon} />
                </span>
              </div>
            ))}
          </dl>
        </div>
        <FacultyVideo />
      </div>
    </section>
  );
}
