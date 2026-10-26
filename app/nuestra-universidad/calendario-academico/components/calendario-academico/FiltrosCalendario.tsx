"use client";

import type { FiltrosCalendario as Filtros } from "@/types/domain";
import styles from "./CalendarioAcademico.module.css";

type FiltrosCalendarioProps = {
  filtros: Filtros;
  categorias: string[];
  tematicas: string[];
  audiencias: string[];
  onChange: (campo: keyof Filtros, valor: string) => void;
};

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className={styles.searchIcon}
      fill="none"
      height="18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="18"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" x2="16.65" y1="21" y2="16.65" />
    </svg>
  );
}

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
        Más filtros
      </h3>
      <p className={styles.filtersSectionHint}>
        Refina la búsqueda por temática, categoría o público.
      </p>

      <div className={styles.filtersGrid}>
        <div className={styles.field}>
          <label htmlFor="calendario-buscar">Buscar</label>
          <div className={styles.inputWithIcon}>
            <SearchIcon />
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
