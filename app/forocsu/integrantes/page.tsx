import type { Metadata } from "next";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import { getIntegrantes } from "@/services/integrantes";
import IntegranteCard from "./integrante-card";

export const metadata: Metadata = {
  title: "Integrantes",
};

export default async function IntegrantesPage() {
  const integrantes = await getIntegrantes();

  return (
    <section className={styles.page} aria-labelledby="integrantes-title">
      <BreadCrumbs variant="onDark" />

      <div className={styles.content}>
        <div className={styles.sectionHeading}>
          <div className={styles.sectionHeadingMain}>
            <span className={styles.sectionHeadingIcon} aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <div>
              <p className={styles.sectionKicker}>Nuestros representantes</p>
              <h1 id="integrantes-title">Conoce al equipo</h1>
            </div>
          </div>
          <p className={styles.resultCount}>
            {integrantes.length}{" "}
            {integrantes.length === 1 ? "integrante" : "integrantes"}
          </p>
        </div>

        {integrantes.length ? (
          <ul className={styles.grid}>
            {integrantes.map((integrante) => (
              <li key={integrante.id}>
                <IntegranteCard integrante={integrante} />
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.emptyState}>
            <h2>Información no disponible</h2>
            <p>
              En este momento no pudimos cargar los integrantes. Intenta nuevamente
              más tarde.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
