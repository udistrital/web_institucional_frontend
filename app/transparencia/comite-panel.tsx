"use client";

import { useState } from "react";
import DocumentCard from "@/components/common/document-card/document-card";
import { ACTAS_COMITE } from "./comite-content";
import styles from "./page.module.css";

type OrdenActas = "recientes" | "antiguas";

function SortIcon({ orden }: { orden: OrdenActas }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {orden === "recientes" ? (
        <>
          <path d="M12 5v14" />
          <path d="m5 12 7 7 7-7" />
        </>
      ) : (
        <>
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </>
      )}
    </svg>
  );
}

export default function ComitePanel() {
  const [orden, setOrden] = useState<OrdenActas>("recientes");
  const actas =
    orden === "recientes" ? ACTAS_COMITE.slice().reverse() : ACTAS_COMITE;

  return (
    <article className={styles.detalleInner} aria-label="Comité">
      <section aria-labelledby="comite-actas-title">
        <h2 id="comite-actas-title" className={styles.normatividadTitulo}>
          Actas de las Sesiones del Comité de Seguimiento a los Índices de
          Transparencia
        </h2>
        <div className={styles.comiteOrden}>
          <p
            className={styles.comiteOrdenTexto}
            aria-live="polite"
            aria-atomic="true"
          >
            Orden actual:{" "}
            {orden === "recientes"
              ? "más reciente a más antigua"
              : "más antigua a más reciente"}
          </p>
          <button
            type="button"
            className={styles.comiteOrdenBoton}
            aria-label="Cambiar orden de las actas"
            onClick={() =>
              setOrden((actual) =>
                actual === "recientes" ? "antiguas" : "recientes",
              )
            }
          >
            <SortIcon orden={orden} />
            Cambiar orden
          </button>
        </div>
        <ul className={`${styles.documentos} ${styles.comiteDocumentos}`}>
          {actas.map((acta) => (
            <li key={acta.url}>
              <DocumentCard
                label={acta.titulo}
                href={acta.url}
                kind="pdf"
                hideArrowOnMobile
              />
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
