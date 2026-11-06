"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Faculty } from "@/services/facultades";
import type { ProgramaAcademico } from "@/services/oferta-academica";
import { normalizarBusqueda, opcionesUnicas, slugFiltro } from "../lib/filtros";

export default function useFiltrosOfertaAcademica({
  programas,
  facultades,
  nivelesFiltro,
  modalidades,
  jornadas,
}: {
  programas: ProgramaAcademico[];
  facultades: Faculty[];
  nivelesFiltro: string[];
  modalidades: string[];
  jornadas: string[];
}) {
  const searchParams = useSearchParams();
  const facultad = searchParams.get("facultad") ?? "";
  const nivel = searchParams.get("nivel") ?? "";
  const modalidad = searchParams.get("modalidad") ?? "";
  const jornada = searchParams.get("jornada") ?? "";
  const busqueda = searchParams.get("q") ?? "";

  const opcionesFacultad = useMemo(
    () =>
      opcionesUnicas([
        ...facultades.map((item) => item.title),
        ...programas.map((programa) => programa.facultad),
      ]),
    [facultades, programas],
  );
  const opcionesNivel = useMemo(
    () => opcionesUnicas(nivelesFiltro),
    [nivelesFiltro],
  );
  const opcionesModalidad = useMemo(
    () => opcionesUnicas(modalidades),
    [modalidades],
  );
  const opcionesJornada = useMemo(
    () => opcionesUnicas(jornadas),
    [jornadas],
  );

  const programasFiltrados = useMemo(() => {
    const consulta = normalizarBusqueda(busqueda);
    return programas.filter((programa) => {
      const coincideFacultad =
        !facultad || slugFiltro(programa.facultad) === facultad;
      const coincideNivel = !nivel || slugFiltro(programa.nivelFiltro) === nivel;
      const coincideModalidad =
        !modalidad || slugFiltro(programa.modalidad) === modalidad;
      const coincideJornada = !jornada || slugFiltro(programa.jornada) === jornada;
      const coincideNombre =
        !consulta || normalizarBusqueda(programa.nombre).includes(consulta);
      return (
        coincideFacultad &&
        coincideNivel &&
        coincideModalidad &&
        coincideJornada &&
        coincideNombre
      );
    });
  }, [busqueda, facultad, jornada, modalidad, nivel, programas]);

  function actualizarUrl(
    nuevaFacultad: string,
    nuevoNivel: string,
    nuevaModalidad: string,
    nuevaJornada: string,
    nuevaBusqueda: string,
  ) {
    const parametros = new URLSearchParams(window.location.search);
    if (nuevaFacultad) parametros.set("facultad", nuevaFacultad);
    else parametros.delete("facultad");
    if (nuevoNivel) parametros.set("nivel", nuevoNivel);
    else parametros.delete("nivel");
    if (nuevaModalidad) parametros.set("modalidad", nuevaModalidad);
    else parametros.delete("modalidad");
    if (nuevaJornada) parametros.set("jornada", nuevaJornada);
    else parametros.delete("jornada");
    if (nuevaBusqueda) parametros.set("q", nuevaBusqueda);
    else parametros.delete("q");
    const query = parametros.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );
  }

  function limpiarFiltros() {
    window.history.replaceState(null, "", window.location.pathname);
  }

  return {
    facultad,
    nivel,
    modalidad,
    jornada,
    busqueda,
    opcionesFacultad,
    opcionesNivel,
    opcionesModalidad,
    opcionesJornada,
    programasFiltrados,
    cambiarFacultad: (valor: string) =>
      actualizarUrl(valor, nivel, modalidad, jornada, busqueda),
    cambiarNivel: (valor: string) =>
      actualizarUrl(facultad, valor, modalidad, jornada, busqueda),
    cambiarModalidad: (valor: string) =>
      actualizarUrl(facultad, nivel, valor, jornada, busqueda),
    cambiarJornada: (valor: string) =>
      actualizarUrl(facultad, nivel, modalidad, valor, busqueda),
    cambiarBusqueda: (valor: string) =>
      actualizarUrl(facultad, nivel, modalidad, jornada, valor),
    limpiarFiltros,
  };
}
