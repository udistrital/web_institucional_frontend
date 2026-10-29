"use client";

import type { FiltrosCalendario as Filtros } from "@/types/domain";
import { SearchIcon } from "./Icons";
import styles from "./CalendarioAcademico.module.css";

type FiltrosCalendarioProps = {
  filtros: Filtros;
  categorias: string[];
  tematicas: string[];
  audiencias: string[];
  onChange: (campo: keyof Filtros, valor: string) => void;
};

export default function FiltrosCalendario({
  filtros,
  categorias,
  tematicas,
  audiencias,
  onChange,
}: FiltrosCalendarioProps) {
  return (
    <section
      aria-labelledby="calendario-filtros-title"
      className={styles.filtersSection}
    >
      <h3 className={styles.filtersSectionTitle} id="calendario-filtros-title">
        Consulta
      </h3>

      <div className={styles.filtersGrid}>
        <div className={styles.field}>
          <label htmlFor="calendario-buscar">Buscar</label>
          <div className={styles.inputWithIcon}>
            <SearchIcon className={styles.searchIcon} />
            <input
              autoComplete="off"
              id="calendario-buscar"
              onChange={(event) => onChange("texto", event.target.value)}
              placeholder="Ej. matrícula, grado..."
              type="search"
              value={filtros.texto}
            />
          </div>
        </div>

        <div className={`${styles.field} ${styles.thematicField}`}>
          <label htmlFor="calendario-tematica">Temática</label>
          <select
            id="calendario-tematica"
            onChange={(event) => onChange("tematica", event.target.value)}
            value={filtros.tematica}
          >
            <option value="">Todas</option>
            {tematicas.map((tematica) => (
              <option key={tematica} value={tematica}>
                {tematica}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="calendario-categoria">Categoría</label>
          <select
            id="calendario-categoria"
            onChange={(event) => onChange("categoria", event.target.value)}
            value={filtros.categoria}
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="calendario-audiencia">Dirigido a</label>
          <select
            id="calendario-audiencia"
            onChange={(event) => onChange("audiencia", event.target.value)}
            value={filtros.audiencia}
          >
            <option value="">Todas</option>
            {audiencias.map((audiencia) => (
              <option key={audiencia} value={audiencia}>
                {audiencia}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
