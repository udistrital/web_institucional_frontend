"use client";

import { useState } from "react";
import styles from "./page.module.css";

type HimnoProps = {
  videoUrl: string;
  estrofas: string[][];
};

/**
 * Himno institucional: el video a un lado y la letra al otro, mostrando una
 * estrofa a la vez con controles para avanzar y retroceder. Así la letra ocupa
 * poco espacio y el usuario la recorre de forma guiada.
 */
export default function Himno({ videoUrl, estrofas }: HimnoProps) {
  const [actual, setActual] = useState(0);
  const total = estrofas.length;

  const ir = (indice: number) => {
    setActual((indice + total) % total);
  };

  return (
    <div className={styles.himno}>
      <div className={styles.himnoVideo}>
        <iframe
          src={videoUrl}
          title="Video del Himno Institucional de la Universidad Distrital"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>

      <div className={styles.himnoLetra}>
        <div className={styles.estrofaCarrusel} aria-live="polite">
          <div className={styles.estrofa}>
            <span className={styles.estrofaNumero}>
              Estrofa {actual + 1} de {total}
            </span>
            <p className={styles.estrofaVersos}>
              {estrofas[actual].map((verso, i) => (
                <span key={i}>{verso}</span>
              ))}
            </p>
          </div>
        </div>

        <div className={styles.carruselControles}>
          <button
            type="button"
            className={styles.carruselBtn}
            onClick={() => ir(actual - 1)}
            aria-label="Estrofa anterior"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <ol className={styles.carruselPuntos}>
            {estrofas.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`${styles.carruselPunto} ${i === actual ? styles.carruselPuntoActivo : ""}`}
                  onClick={() => ir(i)}
                  aria-label={`Ir a la estrofa ${i + 1}`}
                  aria-current={i === actual ? "true" : undefined}
                />
              </li>
            ))}
          </ol>

          <button
            type="button"
            className={styles.carruselBtn}
            onClick={() => ir(actual + 1)}
            aria-label="Estrofa siguiente"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
