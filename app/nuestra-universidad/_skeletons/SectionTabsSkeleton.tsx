import styles from "./skeletons.module.css";

type SectionTabsSkeletonProps = {
  /** Numero de pestañas a dibujar (igual al de la pagina real). */
  tabs?: number;
  /** Etiqueta accesible de la region (p. ej. "Cargando Sobre Nosotros"). */
  label?: string;
};

/**
 * Skeleton compartido para las paginas que usan el patron
 * BreadCrumbs (onDark) + SectionTabs + panel con tarjetas
 * (sobre-nosotros, direccionamiento-estrategico).
 *
 * Reproduce la franja de breadcrumbs, la barra de pestañas sticky y el
 * contenido del primer panel (encabezado de seccion + tarjeta de prosa +
 * grid de tarjetas). Es decorativo: `aria-hidden` lo oculta a lectores de
 * pantalla, que reciben el anuncio de carga del <PageLoader> global.
 */
export default function SectionTabsSkeleton({
  tabs = 4,
  label = "Cargando contenido",
}: SectionTabsSkeletonProps) {
  return (
    <section className={styles.tabsPage} aria-hidden="true" aria-label={label}>
      {/* Breadcrumbs sobre franja roja */}
      <div className={styles.breadcrumbs}>
        <div className={styles.breadcrumbsInner}>
          <span className={`${styles.block} ${styles.blockOnDark} ${styles.crumb}`} />
          <span className={`${styles.block} ${styles.blockOnDark} ${styles.crumb}`} />
        </div>
      </div>

      {/* Barra de pestañas */}
      <div className={styles.tabsBar}>
        <div className={styles.tabsBarInner}>
          {Array.from({ length: tabs }).map((_, i) => (
            <div key={i} className={styles.tab}>
              <span className={`${styles.block} ${styles.tabIcon}`} />
              <span className={`${styles.block} ${styles.tabLabel}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Contenido del primer panel */}
      <div className={styles.tabsContent}>
        <div className={styles.sectionHeading}>
          <span className={`${styles.block} ${styles.sectionHeadingIcon}`} />
          <div className={styles.sectionHeadingText}>
            <span className={`${styles.block} ${styles.kicker}`} />
            <span className={`${styles.block} ${styles.sectionTitle}`} />
          </div>
        </div>

        <div className={styles.proseCard}>
          <div className={`${styles.block} ${styles.line}`} />
          <div className={`${styles.block} ${styles.line}`} />
          <div className={`${styles.block} ${styles.line} ${styles.lineShort}`} />
        </div>

        <div className={styles.cardsGrid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={styles.card}>
              <span className={`${styles.block} ${styles.cardIcon}`} />
              <div className={`${styles.block} ${styles.cardTitle}`} />
              <div className={`${styles.block} ${styles.line}`} />
              <div className={`${styles.block} ${styles.line}`} />
              <div className={`${styles.block} ${styles.line} ${styles.lineShort}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
