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
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Consejo Superior Universitario</p>
          <h1 id="integrantes-title">Integrantes</h1>
          <p className={styles.heroLead}>
            Conoce a las personas que representan a los diferentes estamentos ante
            el Consejo Superior Universitario.
          </p>
        </div>
        <span className={styles.heroNumber} aria-hidden="true">01</span>
      </header>

      <BreadCrumbs />

      <div className={styles.content}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.sectionKicker}>Nuestros representantes</p>
            <h2>Conoce al equipo</h2>
          </div>
          <p className={styles.resultCount}>
            {integrantes.length}{" "}
            {integrantes.length === 1 ? "integrante disponible" : "integrantes disponibles"}
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
