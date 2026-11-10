import type { FacultyStats } from "./faculty-stats";
import FacultyVideo from "./FacultyVideo";
import styles from "./faculty-highlights.module.css";

type FacultyHighlightsProps = {
  /** Total de programas de la facultad; `undefined` si la oferta no cargó. */
  programCount?: number;
  stats?: FacultyStats;
};

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
  programCount,
  stats,
}: FacultyHighlightsProps) {
  const items = [
    { label: "Estudiantes", value: stats?.estudiantes },
    { label: "Programas", value: programCount },
    { label: "Grupos de investigación", value: stats?.gruposInvestigacion },
    { label: "Docentes", value: stats?.docentes },
  ];

  return (
    <section aria-labelledby="facultad-cifras" className={styles.highlights}>
      <div className={styles.inner}>
        <div className={styles.stats}>
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
              </div>
            ))}
          </dl>
        </div>
        <FacultyVideo />
      </div>
    </section>
  );
}
