"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface EmbedPanelProps {
  id: string;
  kicker: string;
  title: string;
  url: string;
  embeddable: boolean;
}

/** Tiempo de espera antes de destacar el enlace para abrir el documento aparte. */
const SLOW_LOAD_MS = 12000;

export default function EmbedPanel({
  id,
  kicker,
  title,
  url,
  embeddable,
}: EmbedPanelProps) {
  const rootRef = useRef<HTMLElement>(null);
  // `activated` pasa a true la primera vez que el panel se hace visible y no
  // vuelve a false: el iframe se queda montado al cambiar de pestaña.
  const [activated, setActivated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  // SectionTabs deja los paneles inactivos con `hidden` (display: none), que
  // no tienen caja de layout. ResizeObserver avisa cuando el panel pasa a
  // tener tamaño, sin depender de la posición del scroll.
  useEffect(() => {
    if (!embeddable || activated) return;
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(() => {
      if (root.getClientRects().length > 0) {
        setActivated(true);
        observer.disconnect();
      }
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [embeddable, activated]);

  useEffect(() => {
    if (!activated || loaded) return;
    const timer = window.setTimeout(() => setSlow(true), SLOW_LOAD_MS);
    return () => window.clearTimeout(timer);
  }, [activated, loaded]);

  const headingId = `${id}-title`;

  return (
    <article ref={rootRef} className={styles.block} aria-labelledby={headingId}>
      <div className={styles.sectionHeading}>
        <div>
          <p className={styles.sectionKicker}>{kicker}</p>
          <h2 id={headingId}>{title}</h2>
        </div>
        {embeddable ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryButton}
          >
            Abrir en una pestaña nueva
          </a>
        ) : null}
      </div>

      <div className={styles.card}>
        {embeddable ? (
          <>
            <div className={styles.viewer}>
              {activated ? (
                <iframe
                  className={styles.frame}
                  src={url}
                  title={title}
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  onLoad={() => setLoaded(true)}
                />
              ) : null}
              {activated && !loaded ? (
                <div className={styles.overlay} role="status">
                  <span className={styles.spinner} aria-hidden="true" />
                  <p>Cargando documento…</p>
                  {slow ? (
                    <>
                      <p className={styles.overlayHint}>
                        El documento tarda más de lo esperado.
                      </p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.primaryButton}
                      >
                        Abrir en una pestaña nueva
                      </a>
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className={styles.fallback}>
            <p>
              Este documento se publica en el sistema de gestión Daruma y se
              consulta en una pestaña nueva.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              Abrir en una pestaña nueva
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
