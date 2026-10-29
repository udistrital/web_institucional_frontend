"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FILTROS_INICIALES,
  fechaHoyBogota,
  filtrarActividades,
  opcionesUnicas,
  type ActividadAcademica,
  type FiltrosCalendario as Filtros,
} from "@/lib/calendario";
import FiltrosCalendario from "./FiltrosCalendario";
import FiltrosFechas from "./FiltrosFechas";
import FiltrosSemestre from "./FiltrosSemestre";
import TarjetaActividad from "./TarjetaActividad";
import { ListIcon, ResetIcon } from "./Icons";
import styles from "./CalendarioAcademico.module.css";

type CalendarioAcademicoProps = {
  actividades: ActividadAcademica[];
  hoyInicial: string;
};

export default function CalendarioAcademico({
  actividades,
  hoyInicial,
}: CalendarioAcademicoProps) {
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIALES);
  const [hoy, setHoy] = useState(hoyInicial);

  useEffect(() => {
    const actualizarHoy = () => setHoy(fechaHoyBogota());

    actualizarHoy();
    const intervalo = window.setInterval(actualizarHoy, 60_000);

    return () => window.clearInterval(intervalo);
  }, []);

  const categorias = useMemo(
    () => opcionesUnicas(actividades.map((actividad) => actividad.categoria)),
    [actividades],
  );

  const tematicas = useMemo(
    () => opcionesUnicas(actividades.map((actividad) => actividad.tematica)),
    [actividades],
  );

  const audiencias = useMemo(
    () =>
      opcionesUnicas(
        actividades.flatMap((actividad) => actividad.audiencias),
      ),
    [actividades],
  );

  const semestres = useMemo(() => {
    const periodos = opcionesUnicas(
      actividades.map((actividad) => actividad.periodo),
    );

    return periodos.map((periodo) => ({
      periodo,
      total: actividades.filter((actividad) => actividad.periodo === periodo)
        .length,
    }));
  }, [actividades]);

  const visibles = useMemo(
    () => filtrarActividades(actividades, filtros),
    [actividades, filtros],
  );

  const hayFiltros =
    Boolean(
      filtros.texto ||
        filtros.desde ||
        filtros.hasta ||
        filtros.categoria ||
        filtros.tematica ||
        filtros.audiencia,
    ) || filtros.semestres.length > 0;

  const actualizarFiltro = (campo: keyof Filtros, valor: string) => {
    setFiltros((actuales) => ({ ...actuales, [campo]: valor }));
  };

  const alternarSemestre = (periodo: string) => {
    setFiltros((actuales) => ({
      ...actuales,
      semestres: actuales.semestres.includes(periodo)
        ? actuales.semestres.filter((semestre) => semestre !== periodo)
        : [...actuales.semestres, periodo],
    }));
  };

  const limpiarFiltros = () => setFiltros(FILTROS_INICIALES);

  return (
    <div className={styles.wrapper}>
      <section aria-label="Filtros del calendario" className={styles.filterPanel}>
        <div className={styles.filterPanelHeader}>
          <div>
            <h2 className={styles.filterPanelTitle}>Filtrar actividades</h2>
            <p className={styles.filterPanelDescription}>
              Selecciona los criterios que te interesan para encontrar la
              actividad ideal.
            </p>
          </div>
          <button
            className={styles.clearButton}
            disabled={!hayFiltros}
            onClick={limpiarFiltros}
            type="button"
          >
            <ResetIcon size={16} />
            Limpiar filtros
          </button>
        </div>

        <div className={styles.filterTopGrid}>
          <FiltrosFechas
            desde={filtros.desde}
            hasta={filtros.hasta}
            onChange={actualizarFiltro}
          />
          <FiltrosSemestre
            onToggle={alternarSemestre}
            opciones={semestres}
            semestres={filtros.semestres}
          />
        </div>

        <FiltrosCalendario
          audiencias={audiencias}
          categorias={categorias}
          filtros={filtros}
          onChange={actualizarFiltro}
          tematicas={tematicas}
        />
      </section>

      <div className={styles.resultsColumn}>
        {visibles.length > 0 && (
          <p aria-live="polite" className={styles.resultsCount} role="status">
            <ListIcon size={16} />
            Mostrando {visibles.length} de {actividades.length} actividades
          </p>
        )}

        {visibles.length > 0 ? (
          <div className={styles.list}>
            {visibles.map((actividad) => (
              <TarjetaActividad
                actividad={actividad}
                hoy={hoy}
                key={actividad.id}
              />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <h3>No encontramos actividades</h3>
            <p>
              No encontramos actividades con los filtros seleccionados. Prueba
              modificando los criterios de búsqueda.
            </p>
            <button
              className={styles.clearButton}
              onClick={limpiarFiltros}
              type="button"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
