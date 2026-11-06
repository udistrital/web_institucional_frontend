"use client";

import type { ContentCardItem } from "@/components/common/content-card";
import FiltrosContenido from "./FiltrosContenido";
import ResultadosContenido from "./ResultadosContenido";
import useFiltrosContenido from "../hooks/useFiltrosContenido";
import styles from "../page.module.css";

type ContenidoCatalogoProps = {
  items: ContentCardItem[];
};

export default function ContenidoCatalogo({ items }: ContenidoCatalogoProps) {
  const filtros = useFiltrosContenido(items);

  return (
    <div className={styles.catalog}>
      <FiltrosContenido
        anio={filtros.anio}
        anios={filtros.opcionesAnio}
        busqueda={filtros.busqueda}
        fuente={filtros.fuente}
        fuentes={filtros.opcionesFuente}
        mes={filtros.mes}
        meses={filtros.opcionesMes}
        tipo={filtros.tipo}
        onAnioChange={filtros.cambiarAnio}
        onBusquedaChange={filtros.cambiarBusqueda}
        onFuenteChange={filtros.cambiarFuente}
        onLimpiar={filtros.limpiarFiltros}
        onMesChange={filtros.cambiarMes}
        onTipoChange={filtros.cambiarTipo}
      />
      <ResultadosContenido
        itemsFiltrados={filtros.itemsFiltrados}
        onLimpiar={filtros.limpiarFiltros}
        total={items.length}
      />
    </div>
  );
}
