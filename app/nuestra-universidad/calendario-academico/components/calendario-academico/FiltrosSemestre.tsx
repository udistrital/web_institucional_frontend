import styles from "./CalendarioAcademico.module.css";

type FiltrosSemestreProps = {
  semestres: string[];
  opciones: Array<{ periodo: string; total: number }>;
  onToggle: (periodo: string) => void;
};

export default function FiltrosSemestre({
  semestres,
  opciones,
  onToggle,
}: FiltrosSemestreProps) {
  return (
    <fieldset className={styles.semesterPanel}>
      <legend className={styles.semesterTitle}>Semestre</legend>

      <div className={styles.semesterOptions}>
        {opciones.map(({ periodo, total }) => {
          const id = `semestre-${periodo.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
          const seleccionado = semestres.includes(periodo);

          return (
            <label
              className={`${styles.semesterOption} ${seleccionado ? styles.semesterOptionSelected : ""}`}
              htmlFor={id}
              key={periodo}
            >
              <input
                checked={seleccionado}
                id={id}
                onChange={() => onToggle(periodo)}
                type="checkbox"
                value={periodo}
              />
              <span className={styles.semesterCheck} aria-hidden="true">
                <svg fill="none" viewBox="0 0 16 16">
                  <path d="m3.5 8 3 3 6-6" />
                </svg>
              </span>
              <span className={styles.semesterLabel}>{periodo}</span>
              <span className={styles.semesterCount}>{total}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
