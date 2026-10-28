"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { HitoHistorico } from "./content";
import styles from "./page.module.css";

type HistoriaTimelineProps = {
  hitos: HitoHistorico[];
};

/**
 * Línea de tiempo de la historia de la Universidad.
 *
 * Cada hito muestra solo la fecha y el título para mantener la línea compacta.
 * Al activarlo se abre una modal con la imagen y el resumen completo. Las
 * tarjetas se alternan a lado y lado de un eje central en escritorio y se
 * apilan en móvil. Respeta la preferencia de movimiento reducido.
 */
export default function HistoriaTimeline({ hitos }: HistoriaTimelineProps) {
  const reduceMotion = useReducedMotion();
  const [activo, setActivo] = useState<HitoHistorico | null>(null);
  const titleId = useId();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Bloquear el scroll del body mientras la modal está abierta.
  useEffect(() => {
    if (!activo) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activo]);

  // Cerrar con Escape.
  useEffect(() => {
    if (!activo) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivo(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activo]);

  return (
    <>
      <ol className={styles.timeline}>
        {hitos.map((hito, index) => {
          const lado = index % 2 === 0 ? styles.timelineLeft : styles.timelineRight;

          return (
            <motion.li
              key={`${hito.anio}-${hito.titulo}`}
              className={`${styles.timelineItem} ${lado}`}
              initial={reduceMotion ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -80px 0px" }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
            >
              <span className={styles.timelineDot} aria-hidden="true" />
              <button
                type="button"
                className={styles.timelineCard}
                onClick={() => setActivo(hito)}
                aria-haspopup="dialog"
              >
                <span className={styles.timelineContent}>
                  <span className={styles.timelineYear}>{hito.anio}</span>
                  <span className={styles.timelineTitle}>{hito.titulo}</span>
                  <span className={styles.timelineMore} aria-hidden="true">
                    Ver más
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </span>
                {hito.imagen && (
                  <span className={styles.timelineThumb}>
                    <Image
                      src={hito.imagen}
                      alt=""
                      fill
                      sizes="7rem"
                      className={styles.timelineThumbInner}
                    />
                  </span>
                )}
              </button>
            </motion.li>
          );
        })}
      </ol>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {activo && (
              <motion.div
                className={styles.overlay}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                onClick={() => setActivo(null)}
              >
                <motion.div
                  className={styles.modal}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  onClick={(event) => event.stopPropagation()}
                >
                  <button
                    type="button"
                    className={styles.modalClose}
                    onClick={() => setActivo(null)}
                    aria-label="Cerrar"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </button>

                  {activo.imagen && (
                    <div className={styles.modalImage}>
                      <Image
                        src={activo.imagen}
                        alt={activo.imagenAlt ?? ""}
                        fill
                        sizes="(max-width: 720px) 100vw, 44rem"
                        className={styles.modalImageInner}
                      />
                    </div>
                  )}

                  <div className={styles.modalBody}>
                    <span className={styles.modalYear}>{activo.anio}</span>
                    <h3 id={titleId} className={styles.modalTitle}>
                      {activo.titulo}
                    </h3>
                    <p className={styles.modalText}>{activo.descripcion}</p>
                    {activo.imagenAlt && (
                      <p className={styles.modalCaption}>{activo.imagenAlt}</p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
