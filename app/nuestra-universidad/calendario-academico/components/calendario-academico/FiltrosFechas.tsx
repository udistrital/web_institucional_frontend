"use client";

import styles from "./CalendarioAcademico.module.css";

type FiltrosFechasProps = {
  desde: string;
  hasta: string;
  onChange: (campo: "desde" | "hasta", valor: string) => void;
};

export default function FiltrosFechas({
  desde,
  hasta,
  onChange,
}: FiltrosFechasProps) {
  return (
    <section
      aria-labelledby="calendario-fechas-title"
      className={styles.dates}
    >
      <div className={styles.datesHeader}>
        <h2 className={styles.datesTitle} id="calendario-fechas-title">
          Filtrar por fechas
        </h2>
        <p className={styles.datesHint}>
          Se muestran las actividades que coinciden con el rango seleccionado.
        </p>
      </div>

      <div className={styles.datesFields}>
        <div className={styles.field}>
          <label htmlFor="calendario-desde">Desde</label>
          <input
            id="calendario-desde"
            max={hasta || undefined}
            onChange={(event) => onChange("desde", event.target.value)}
            type="date"
            value={desde}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="calendario-hasta">Hasta</label>
          <input
            id="calendario-hasta"
            min={desde || undefined}
            onChange={(event) => onChange("hasta", event.target.value)}
            type="date"
            value={hasta}
          />
        </div>
      </div>
    </section>
  );
}
