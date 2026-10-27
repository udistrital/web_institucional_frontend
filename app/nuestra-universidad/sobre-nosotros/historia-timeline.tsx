"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { HitoHistorico } from "./content";
import styles from "./page.module.css";

type HistoriaTimelineProps = {
  hitos: HitoHistorico[];
};

/**
 * Línea de tiempo interactiva de la historia de la Universidad.
 *
 * Cada hito aparece con una animación suave al entrar en pantalla y se alterna
 * a lado y lado de un eje central en escritorio. En móvil se apila en una sola
 * columna. Respeta la preferencia de movimiento reducido del usuario.
 */
export default function HistoriaTimeline({ hitos }: HistoriaTimelineProps) {
  const reduceMotion = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  return (
    <ol className={styles.timeline} ref={listRef}>
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
            <div className={styles.timelineCard}>
              <span className={styles.timelineYear}>{hito.anio}</span>
              <h3 className={styles.timelineTitle}>{hito.titulo}</h3>
              <p className={styles.timelineText}>{hito.descripcion}</p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
