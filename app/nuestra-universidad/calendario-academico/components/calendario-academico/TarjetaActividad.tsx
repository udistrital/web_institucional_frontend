import type { ActividadAcademica } from "@/types/domain";
import {
  estadoEvento,
  formatearRangoFechas,
  slugCategoria,
} from "@/lib/calendario";
import styles from "./CalendarioAcademico.module.css";

type TarjetaActividadProps = {
  actividad: ActividadAcademica;
  hoy: string;
};

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.icon}
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

export default function TarjetaActividad({
  actividad,
  hoy,
}: TarjetaActividadProps) {
  const categoria = actividad.categoria;
  const estado = estadoEvento(actividad, hoy);
  const audiencias = actividad.audiencias.join(" · ");
  const responsables = actividad.responsables.join(" · ");

  return (
    <article
      className={styles.card}
      data-categoria={slugCategoria(categoria)}
      data-estado={estado}
    >
      <div className={styles.cardTop}>
        <div className={styles.cardTags}>
          {categoria && <span className={styles.badge}>{categoria}</span>}
          {actividad.esFechaLimite && (
            <span className={styles.deadline}>Fecha límite</span>
          )}
          {actividad.periodo && (
            <span className={styles.period}>{actividad.periodo}</span>
          )}
        </div>

        {estado === "abierto" && (
          <span className={styles.statusOpen}>Evento abierto</span>
        )}
        {estado === "finalizado" && (
          <span className={styles.statusFinished}>Evento finalizado</span>
        )}
      </div>

      <h3 className={styles.cardTitle}>{actividad.titulo}</h3>

      {actividad.nota && <p className={styles.note}>{actividad.nota}</p>}

      <dl className={styles.meta}>
        <div className={styles.metaRow}>
          <dt>Fechas</dt>
          <dd className={styles.dateValue}>
            <CalendarIcon />
            <span>
              {formatearRangoFechas(
                actividad.fechaInicio,
                actividad.fechaFin,
              )}
            </span>
          </dd>
        </div>

        {audiencias && (
          <div className={styles.metaRow}>
            <dt>Dirigido a</dt>
            <dd>{audiencias}</dd>
          </div>
        )}

        {responsables && (
          <div className={styles.metaRow}>
            <dt>Responsable</dt>
            <dd>{responsables}</dd>
          </div>
        )}

        {actividad.tematica && (
          <div className={styles.metaRow}>
            <dt>Temática</dt>
            <dd>{actividad.tematica}</dd>
          </div>
        )}

        {actividad.articulo !== null && (
          <div className={styles.metaRow}>
            <dt>Artículo</dt>
            <dd>{actividad.articulo}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
