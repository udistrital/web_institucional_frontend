"use client";

import type { Faculty } from "@/services/facultades";
import type { ProgramaAcademico } from "@/services/oferta-academica";
import FiltrosOfertaAcademica from "./FiltrosOfertaAcademica";
import ResultadosOfertaAcademica from "./ResultadosOfertaAcademica";
import useFiltrosOfertaAcademica from "../hooks/useFiltrosOfertaAcademica";
import styles from "../page.module.css";

type OfertaAcademicaCatalogoProps = {
  programas: ProgramaAcademico[];
  facultades: Faculty[];
  nivelesFiltro: string[];
  modalidades: string[];
  jornadas: string[];
  noDisponible: boolean;
};

export default function OfertaAcademicaCatalogo({
  programas,
  facultades,
  nivelesFiltro,
  modalidades,
  jornadas,
  noDisponible,
}: OfertaAcademicaCatalogoProps) {
  const filtros = useFiltrosOfertaAcademica({
    programas,
    facultades,
    nivelesFiltro,
    modalidades,
    jornadas,
  });

  return (
    <div className={styles.catalog}>
      <div className={styles.catalogLayout}>
        <FiltrosOfertaAcademica
          busqueda={filtros.busqueda}
          facultad={filtros.facultad}
          facultades={filtros.opcionesFacultad}
          nivel={filtros.nivel}
          modalidad={filtros.modalidad}
          jornada={filtros.jornada}
          niveles={filtros.opcionesNivel}
          modalidades={filtros.opcionesModalidad}
          jornadas={filtros.opcionesJornada}
          onBusquedaChange={filtros.cambiarBusqueda}
          onFacultadChange={filtros.cambiarFacultad}
          onModalidadChange={filtros.cambiarModalidad}
          onJornadaChange={filtros.cambiarJornada}
          onLimpiar={filtros.limpiarFiltros}
          onNivelChange={filtros.cambiarNivel}
        />
        <ResultadosOfertaAcademica
          facultades={facultades}
          noDisponible={noDisponible}
          onLimpiar={filtros.limpiarFiltros}
          programas={programas}
          programasFiltrados={filtros.programasFiltrados}
        />
      </div>
    </div>
  );
}
