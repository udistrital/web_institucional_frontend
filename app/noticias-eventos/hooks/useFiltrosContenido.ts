"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { normalizarBusqueda } from "@/lib/filtros";
import type { ContentCardItem, ContentKind } from "@/components/common/content-card";
import {
  aniosDisponibles,
  fuentesDisponibles,
  itemCubreAnio,
  itemCubreMes,
  mesesDisponibles,
} from "../lib/contenido";

const TIPOS_VALIDOS: ContentKind[] = ["noticia", "evento"];

function esTipoValido(valor: string): valor is ContentKind {
  return (TIPOS_VALIDOS as string[]).includes(valor);
}

export default function useFiltrosContenido(items: ContentCardItem[]) {
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get("tipo") ?? "";
  const tipo = esTipoValido(tipoParam) ? tipoParam : "";
  const anio = searchParams.get("anio") ?? "";
  const mes = searchParams.get("mes") ?? "";
  const fuente = searchParams.get("fuente") ?? "";
  const busqueda = searchParams.get("q") ?? "";

  const opcionesAnio = useMemo(() => aniosDisponibles(items), [items]);
  const opcionesMes = useMemo(() => mesesDisponibles(items), [items]);
  const opcionesFuente = useMemo(() => fuentesDisponibles(items), [items]);

  const itemsFiltrados = useMemo(() => {
    const consulta = normalizarBusqueda(busqueda);
    return items.filter((item) => {
      const coincideTipo = !tipo || item.kind === tipo;
      // El año y el mes consideran el rango completo del evento, no solo su
      // fecha de inicio.
      const coincideAnio = !anio || itemCubreAnio(item, anio);
      const coincideMes = !mes || itemCubreMes(item, mes);
      const coincideFuente = !fuente || (item.source ?? "") === fuente;
      const coincideBusqueda =
        !consulta || normalizarBusqueda(item.title).includes(consulta);
      return (
        coincideTipo &&
        coincideAnio &&
        coincideMes &&
        coincideFuente &&
        coincideBusqueda
      );
    });
  }, [anio, busqueda, fuente, items, mes, tipo]);

  function actualizarUrl(
    nuevoTipo: string,
    nuevoAnio: string,
    nuevoMes: string,
    nuevaFuente: string,
    nuevaBusqueda: string,
  ) {
    const parametros = new URLSearchParams(window.location.search);
    if (nuevoTipo) parametros.set("tipo", nuevoTipo);
    else parametros.delete("tipo");
    if (nuevoAnio) parametros.set("anio", nuevoAnio);
    else parametros.delete("anio");
    if (nuevoMes) parametros.set("mes", nuevoMes);
    else parametros.delete("mes");
    if (nuevaFuente) parametros.set("fuente", nuevaFuente);
    else parametros.delete("fuente");
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
    tipo,
    anio,
    mes,
    fuente,
    busqueda,
    opcionesAnio,
    opcionesMes,
    opcionesFuente,
    itemsFiltrados,
    cambiarTipo: (valor: string) =>
      actualizarUrl(valor, anio, mes, fuente, busqueda),
    cambiarAnio: (valor: string) =>
      actualizarUrl(tipo, valor, mes, fuente, busqueda),
    cambiarMes: (valor: string) =>
      actualizarUrl(tipo, anio, valor, fuente, busqueda),
    cambiarFuente: (valor: string) =>
      actualizarUrl(tipo, anio, mes, valor, busqueda),
    cambiarBusqueda: (valor: string) =>
      actualizarUrl(tipo, anio, mes, fuente, valor),
    limpiarFiltros,
  };
}
