import styles from "./_skeletons/skeletons.module.css";

/**
 * Skeleton de carga de la "Oferta academica".
 *
 * Next.js lo muestra (via Suspense) mientras resuelve el segmento y carga la
 * oferta academica y las facultades. Reproduce el panel de filtros (icono +
 * cuadricula de campos) y la lista de tarjetas de programa (media + resumen).
 * Decorativo: `aria-hidden` lo oculta a lectores de pantalla.
 */
export default function Loading() {
  return (
    <main className={styles.ofertaPage} aria-hidden="true" aria-label="Cargando Oferta academica">
      <div className={styles.ofertaCatalog}>
        {/* Panel de filtros */}
        <div className={styles.ofertaFilters}>
          <div className={styles.ofertaFiltersHead}>
            <span className={`${styles.block} ${styles.ofertaFiltersIcon}`} />
            <div className={styles.sectionHeadingText}>
              <span className={`${styles.block} ${styles.kicker}`} />
              <span className={`${styles.block} ${styles.sectionTitle}`} style={{ width: "12rem" }} />
            </div>
          </div>
          <div className={styles.ofertaFiltersGrid}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={`${styles.block} ${styles.ofertaField}`} />
            ))}
          </div>
        </div>

        {/* Resultados */}
        <div>
          <span className={`${styles.block} ${styles.ofertaResultsHead}`} />
          <div className={styles.ofertaList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.ofertaCard}>
                <span className={`${styles.block} ${styles.ofertaMedia}`} />
                <div className={styles.ofertaContent}>
                  <span className={`${styles.block} ${styles.ofertaCardTitle}`} />
                  <span className={`${styles.block} ${styles.line}`} />
                  <div className={styles.ofertaSummary}>
                    {Array.from({ length: 3 }).map((__, j) => (
                      <span key={j} className={`${styles.block} ${styles.ofertaSummaryItem}`} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
