"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Integrante } from "@/services/integrantes";
import styles from "./page.module.css";

function getIniciales(nombre: string) {
  const palabras = nombre.trim().split(/\s+/);
  const iniciales = palabras.slice(0, 2).map((palabra) => palabra.charAt(0));
  return iniciales.join("").toUpperCase() || "UD";
}

function toParrafos(texto: string) {
  return texto
    .split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean);
}

type IntegranteCardProps = {
  integrante: Integrante;
};

export default function IntegranteCard({ integrante }: IntegranteCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const titleId = useId();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const parrafos = integrante.descripcion ? toParrafos(integrante.descripcion) : [];
  const tieneBio = parrafos.length > 0;

  // Bloquear scroll del body mientras la modal está abierta
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const foto = integrante.imageUrl ? (
    <Image
      src={integrante.imageUrl}
      alt={integrante.imageAlt}
      fill
      sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
      className={styles.image}
    />
  ) : (
    <span className={styles.imageFallback} aria-hidden="true">
      {getIniciales(integrante.nombre)}
    </span>
  );

  return (
    <>
      <article className={styles.card}>
        <div className={styles.cardImage}>{foto}</div>

        <div className={styles.cardBody}>
          <h3>{integrante.nombre}</h3>
          {integrante.puesto && (
            <p className={styles.puesto}>
              <span>Representación</span>
              {integrante.puesto}
            </p>
          )}

          {tieneBio && (
            <button
              type="button"
              className={styles.bioTrigger}
              onClick={() => setIsOpen(true)}
            >
              Ver trayectoria
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>
      </article>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className={styles.overlay}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                onClick={() => setIsOpen(false)}
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
                    onClick={() => setIsOpen(false)}
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

                  <header className={styles.modalHeader}>
                    <div className={styles.modalAvatar}>{foto}</div>
                    <div>
                      <h2 id={titleId} className={styles.modalName}>
                        {integrante.nombre}
                      </h2>
                      {integrante.puesto && (
                        <p className={styles.modalPuesto}>{integrante.puesto}</p>
                      )}
                    </div>
                  </header>

                  <div className={styles.modalBody}>
                    {parrafos.map((parrafo, index) => (
                      <p key={index}>{parrafo}</p>
                    ))}
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
