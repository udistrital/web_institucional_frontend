"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import DocumentCard from "@/components/common/document-card/document-card";
import type { CategoriaTransparencia } from "./content";
import { CategoriaIcon } from "./icons";
import styles from "./page.module.css";

type TransparenciaMosaicoProps = {
  categorias: CategoriaTransparencia[];
};

/**
 * Mosaico de las 13 categorías de la Ley 1712 de 2014.
 *
 * Cada tarjeta es un botón con icono, título y una descripción breve. Al
 * activarlo se abre una modal con las subsecciones de la categoría y, bajo
 * cada una, los enlaces oficiales presentados con la tarjeta de documento
 * compartida (DocumentCard). La modal replica el patrón de accesibilidad de la
 * línea de tiempo de "Sobre nosotros": role="dialog", aria-modal, cierre con
 * Escape y por overlay, bloqueo del scroll del body y respeto de la
 * preferencia de movimiento reducido.
 */
export default function TransparenciaMosaico({
  categorias,
}: TransparenciaMosaicoProps) {
  const reduceMotion = useReducedMotion();
  const [activa, setActiva] = useState<CategoriaTransparencia | null>(null);
  const titleId = useId();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // Bloquear el scroll del body mientras la modal está abierta.
  useEffect(() => {
    if (!activa) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activa]);

  // Cerrar con Escape.
  useEffect(() => {
    if (!activa) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiva(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activa]);

  return (
    <>
      <ul className={styles.mosaico}>
        {categorias.map((categoria) => (
          <li key={categoria.id}>
            <button
              type="button"
              className={styles.tarjeta}
              onClick={() => setActiva(categoria)}
              aria-haspopup="dialog"
            >
              <span className={styles.tarjetaIcono} aria-hidden="true">
                <CategoriaIcon id={categoria.id} />
              </span>
              <span className={styles.tarjetaNumero}>
                Categoría {categoria.numero}
              </span>
              <span className={styles.tarjetaTitulo}>{categoria.titulo}</span>
              <span className={styles.tarjetaDescripcion}>
                {categoria.descripcion}
              </span>
              <span className={styles.tarjetaVerMas} aria-hidden="true">
                Ver información
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
            </button>
          </li>
        ))}
      </ul>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {activa && (
              <motion.div
                className={styles.overlay}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.2 }}
                onClick={() => setActiva(null)}
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
                    onClick={() => setActiva(null)}
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

                  <div className={styles.modalBody}>
                    <div className={styles.modalHeader}>
                      <span className={styles.modalHeaderIcono} aria-hidden="true">
                        <CategoriaIcon id={activa.id} />
                      </span>
                      <div>
                        <p className={styles.modalKicker}>
                          Categoría {activa.numero}
                        </p>
                        <h3 id={titleId} className={styles.modalTitulo}>
                          {activa.titulo}
                        </h3>
                      </div>
                    </div>

                    {activa.subsecciones.map((subseccion) => (
                      <section
                        className={styles.subseccion}
                        key={subseccion.numero}
                      >
                        <h4 className={styles.subseccionTitulo}>
                          {subseccion.numero}. {subseccion.titulo}
                        </h4>
                        <ul className={styles.enlacesGrid}>
                          {subseccion.enlaces.map((enlace) => (
                            <li key={enlace.url + enlace.titulo}>
                              <DocumentCard
                                label={enlace.titulo}
                                href={enlace.url}
                                kind={
                                  enlace.url.toLowerCase().endsWith(".pdf")
                                    ? "pdf"
                                    : "enlace"
                                }
                                className={styles.documentCardWhite}
                              />
                            </li>
                          ))}
                        </ul>
                      </section>
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
