"use client";

import { useId, useState } from "react";
import type { GrupoNormativo } from "./content";
import styles from "./page.module.css";

type NormatividadBrowserProps = {
  grupos: GrupoNormativo[];
};

/**
 * Explorador de normatividad.
 *
 * La normatividad es extensa, así que se agrupa por categoría (Estatutos,
 * Planes, Distrital, Nacional) y se muestra un grupo a la vez. El usuario
 * cambia de grupo con un grupo de botones tipo "segmented control" en pantallas
 * amplias y con un `select` nativo en móvil, donde los botones no caben bien.
 * Ambos controles comparten el mismo estado.
 */
export default function NormatividadBrowser({ grupos }: NormatividadBrowserProps) {
  const [activo, setActivo] = useState(0);
  const selectId = useId();

  const grupoActivo = grupos[activo];

  return (
    <div className={styles.normaBrowser}>
      {/* Móvil: select nativo (accesible y compacto). */}
      <div className={styles.normaSelectWrap}>
        <label className={styles.normaSelectLabel} htmlFor={selectId}>
          Categoría de normas
        </label>
        <select
          id={selectId}
          className={styles.normaSelect}
          value={activo}
          onChange={(event) => setActivo(Number(event.target.value))}
        >
          {grupos.map((grupo, index) => (
            <option key={grupo.titulo} value={index}>
              {grupo.titulo} ({grupo.normas.length})
            </option>
          ))}
        </select>
      </div>

      {/* Escritorio: botones tipo segmented control. */}
      <div
        className={styles.normaFiltros}
        role="tablist"
        aria-label="Categorías de normatividad"
      >
        {grupos.map((grupo, index) => {
          const esActivo = index === activo;
          return (
            <button
              key={grupo.titulo}
              type="button"
              role="tab"
              id={`norma-tab-${index}`}
              aria-selected={esActivo}
              aria-controls={`norma-panel-${index}`}
              tabIndex={esActivo ? 0 : -1}
              className={`${styles.normaFiltro} ${esActivo ? styles.normaFiltroActivo : ""}`}
              onClick={() => setActivo(index)}
            >
              {grupo.titulo}
              <span className={styles.normaFiltroCount}>{grupo.normas.length}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`norma-panel-${activo}`}
        role="tabpanel"
        aria-labelledby={`norma-tab-${activo}`}
      >
        <ul className={styles.normaGrid}>
          {grupoActivo.normas.map((norma) => (
            <li className={styles.normaCard} key={norma.url + norma.titulo}>
              <a
                className={styles.normaLink}
                href={norma.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.normaTitulo}>{norma.titulo}</span>
                <span className={styles.normaIcono} aria-hidden="true">
                  ↗
                </span>
              </a>
              {norma.descripcion && (
                <p className={styles.normaDesc}>{norma.descripcion}</p>
              )}
              {norma.actualizado && (
                <p className={styles.normaFecha}>Actualizado el {norma.actualizado}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
