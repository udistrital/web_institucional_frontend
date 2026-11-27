import styles from "./page.module.css";

/**
 * Skeleton de carga de "Transparencia y acceso a la información pública".
 *
 * Next.js lo muestra (vía Suspense) mientras resuelve el segmento. Reproduce
 * la franja de breadcrumbs y la grilla del mosaico con 13 bloques placeholder.
 * Es puramente decorativo, por eso se marca aria-hidden.
 */
export default function Loading() {
  return (
    <div aria-hidden="true">
      <div className={`${styles.skeletonBreadcrumb} ${styles.skeletonBloque}`} />
      <div className={styles.content}>
        <ul className={styles.mosaico}>
          {Array.from({ length: 13 }).map((_, index) => (
            <li key={index}>
              <div
                className={`${styles.skeletonTarjeta} ${styles.skeletonBloque}`}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
