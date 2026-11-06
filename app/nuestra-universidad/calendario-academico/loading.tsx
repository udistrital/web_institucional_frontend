import styles from "../_skeletons/skeletons.module.css";

/**
 * Skeleton de carga del "Calendario academico".
 *
 * Next.js lo muestra (via Suspense) mientras resuelve el segmento y carga las
 * actividades academicas. Reproduce el hero de dos zonas (texto + visual con
 * recorte diagonal) y el cuerpo con el panel de filtros y las tarjetas de
 * actividad. Decorativo: `aria-hidden` lo oculta a lectores de pantalla.
 */
export default function Loading() {
  return (
    <div className={styles.calPage} aria-hidden="true" aria-label="Cargando Calendario academico">
      <header className={styles.calHero}>
        <div className={styles.calHeroText}>
          <span className={`${styles.block} ${styles.calEyebrow}`} />
          <span className={`${styles.block} ${styles.calTitle}`} />
          <span className={`${styles.block} ${styles.line}`} />
          <span className={`${styles.block} ${styles.line} ${styles.lineShort}`} />
        </div>
        <div className={styles.calVisual} />
      </header>

      <div className={styles.calBody}>
        {/* Panel de filtros */}
        <div className={styles.calPanel}>
          <span className={`${styles.block} ${styles.lineLg}`} style={{ width: "14rem" }} />
          <div className={styles.calFiltersRow}>
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className={`${styles.block} ${styles.calField}`} />
            ))}
          </div>
        </div>

        {/* Lista de actividades */}
        <div className={styles.calPanel}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`${styles.block} ${styles.calActivity}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
