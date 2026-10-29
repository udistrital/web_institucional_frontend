import type { ReactNode } from "react";
import type { ActividadAcademica } from "@/types/domain";
import {
  estadoEvento,
  formatearRangoFechas,
  slugCategoria,
} from "@/lib/calendario";
import Image from "next/image";
import {
  BuildingIcon,
  CalendarIcon,
  TagIcon,
  UsersIcon,
} from "./Icons";
import styles from "./CalendarioAcademico.module.css";

type TarjetaActividadProps = {
  actividad: ActividadAcademica;
  hoy: string;
};

const MESES_CORTOS = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

type ParteFecha = { dia: string; mes: string } | null;

function parteFecha(iso: string | null): ParteFecha {
  if (!iso) return null;

  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day || !MESES_CORTOS[month - 1]) return null;

  return { dia: String(day).padStart(2, "0"), mes: MESES_CORTOS[month - 1] };
}

function imagenSemestre(periodo: string | null): string | null {
  if (!periodo) return null;

  const normalizado = periodo.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (normalizado.endsWith("iii") || normalizado.endsWith("3")) {
    return "/image/calendario-academico/UD-rojo-calendar.jpg";
  }
  if (normalizado.endsWith("ii") || normalizado.endsWith("2")) {
    return "/image/calendario-academico/UD-azul-calendar.jpg";
  }
  return "/image/calendario-academico/UD-amarillo-calendar.jpg";
}

type MetaItemProps = {
  icon: ReactNode;
  label: string;
  children: ReactNode;
};

function MetaItem({ icon, label, children }: MetaItemProps) {
  return (
    <div className={styles.metaItem}>
      <span className={styles.metaIcon}>{icon}</span>
      <div className={styles.metaText}>
        <span className={styles.metaLabel}>{label}</span>
        <p className={styles.metaValue}>{children}</p>
      </div>
    </div>
  );
}

function EstadoActividad({
  estado,
}: {
  estado: "abierto" | "finalizado" | "sin-fecha";
}) {
  if (estado === "finalizado") {
    return <span className={styles.statusFinished}>Evento finalizado</span>;
  }
  if (estado === "abierto") {
    return <span className={styles.statusOpen}>Evento abierto</span>;
  }
  return <span className={styles.statusNeutral}>Fecha por definir</span>;
}

export default function TarjetaActividad({
  actividad,
  hoy,
}: TarjetaActividadProps) {
  const categoria = actividad.categoria;
  const estado = estadoEvento(actividad, hoy);
  const audiencias = actividad.audiencias.join(" · ");
  const responsables = actividad.responsables.join(" · ");
  const rangoFechas = formatearRangoFechas(
    actividad.fechaInicio,
    actividad.fechaFin,
  );

  const inicio = parteFecha(actividad.fechaInicio);
  const fin = parteFecha(actividad.fechaFin);
  const tieneRango = Boolean(
    inicio && fin && actividad.fechaInicio !== actividad.fechaFin,
  );
  const imagenPeriodo = imagenSemestre(actividad.periodo);

  return (
    <article
      className={styles.card}
      data-categoria={slugCategoria(categoria)}
      data-estado={estado}
    >
      <div className={styles.dateBlock}>
        {imagenPeriodo && (
          <Image
            alt=""
            className={styles.dateBlockImage}
            fill
            sizes="(max-width: 640px) 100vw, 140px"
            src={imagenPeriodo}
          />
        )}
        <span aria-hidden="true" className={styles.dateBlockOverlay} />
        {actividad.periodo && (
          <span className={styles.dateBlockPeriod}>{actividad.periodo}</span>
        )}
        <div className={styles.dateBlockDates}>
          {inicio ? (
            <>
              <span className={styles.dateBlockDay}>{inicio.dia}</span>
              <span className={styles.dateBlockMonth}>{inicio.mes}</span>
            </>
          ) : (
            <span className={styles.dateBlockMonth}>Por definir</span>
          )}

          {tieneRango && fin && (
            <>
              <span className={styles.dateBlockTo}>al</span>
              <span className={styles.dateBlockDay}>{fin.dia}</span>
              <span className={styles.dateBlockMonth}>{fin.mes}</span>
            </>
          )}
        </div>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <div className={styles.cardTags}>
            {categoria && <span className={styles.badge}>{categoria}</span>}
            {actividad.esFechaLimite && (
              <span className={styles.deadline}>Fecha límite</span>
            )}
          </div>

          <div className={styles.cardTopActions}>
            <EstadoActividad estado={estado} />
          </div>
        </div>

        <h3 className={styles.cardTitle}>{actividad.titulo}</h3>

        {actividad.nota && <p className={styles.note}>{actividad.nota}</p>}

        <div className={styles.meta}>
          <div className={styles.metaColumn}>
            <MetaItem icon={<CalendarIcon size={16} />} label="Fechas">
              {rangoFechas}
            </MetaItem>

            {audiencias && (
              <MetaItem icon={<UsersIcon size={16} />} label="Dirigido a">
                {audiencias}
              </MetaItem>
            )}

          </div>

          <div className={styles.metaColumn}>
            {responsables && (
              <MetaItem icon={<BuildingIcon size={16} />} label="Responsable">
                {responsables}
              </MetaItem>
            )}

            {actividad.tematica && (
              <MetaItem icon={<TagIcon size={16} />} label="Temática">
                {actividad.tematica}
              </MetaItem>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
