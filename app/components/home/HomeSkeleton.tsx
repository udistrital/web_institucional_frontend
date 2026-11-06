import styles from "./HomeSkeleton.module.css";

/**
 * Skeleton de la pagina de inicio.
 *
 * Se usa como `fallback` del <Suspense> que envuelve el contenido asincrono
 * de la home (facultades, hero y noticias). Reproduce la silueta de cada
 * seccion real para transmitir sensacion de carga instantanea y reducir el
 * salto de layout cuando el contenido entra por streaming.
 *
 * Es puramente decorativo: `aria-hidden` lo oculta a lectores de pantalla,
 * que reciben el anuncio de carga a traves del <PageLoader> global.
 */
export default function HomeSkeleton() {
  return (
    <div className={styles.root} aria-hidden="true">
      {/* Hero / banner principal */}
      <div className={`${styles.block} ${styles.hero}`} />

      {/* Accesos rapidos (3 tarjetas) */}
      <section className={styles.quickLinks}>
        <div className={styles.quickLinksGrid}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`${styles.block} ${styles.quickCard}`} />
          ))}
        </div>
      </section>

      {/* Facultades (fondo rojo + cortina de paneles) */}
      <section className={styles.faculties}>
        <div className={styles.facultiesIntro}>
          <div className={`${styles.block} ${styles.blockOnDark} ${styles.facultiesTitle}`} />
          <div className={`${styles.block} ${styles.blockOnDark} ${styles.facultiesButton}`} />
        </div>
        <div className={styles.curtain}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${styles.block} ${styles.blockOnDark} ${styles.curtainPanel}`} />
          ))}
        </div>
      </section>

      {/* Noticias (grid de 3 tarjetas) */}
      <section className={styles.news}>
        <div className={styles.newsInner}>
          <div className={`${styles.block} ${styles.newsTitle}`} />
          <div className={styles.newsGrid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={styles.newsCard}>
                <div className={`${styles.block} ${styles.newsImage}`} />
                <div className={styles.newsBody}>
                  <div className={`${styles.block} ${styles.lineLg}`} />
                  <div className={`${styles.block} ${styles.line}`} />
                  <div className={`${styles.block} ${styles.line} ${styles.lineShort}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inscripciones (banner rojo) */}
      <section className={styles.enrollment}>
        <div className={styles.enrollmentInner}>
          <div className={`${styles.block} ${styles.blockOnDark} ${styles.enrollmentTitle}`} />
          <div className={`${styles.block} ${styles.blockOnDark} ${styles.line}`} style={{ maxWidth: "34rem" }} />
          <div className={styles.enrollmentActions}>
            <div className={`${styles.block} ${styles.blockOnDark} ${styles.enrollmentButton}`} />
            <div className={`${styles.block} ${styles.blockOnDark} ${styles.enrollmentButton}`} />
          </div>
        </div>
      </section>

      {/* Servicios al estudiante (grid dorado de 4) */}
      <section className={styles.studentServices}>
        <div className={styles.studentGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.studentItem}>
              <div className={`${styles.block} ${styles.blockOnGold} ${styles.studentIcon}`} />
              <div className={`${styles.block} ${styles.blockOnGold} ${styles.studentLine}`} />
              <div className={`${styles.block} ${styles.blockOnGold} ${styles.studentLine} ${styles.lineShort}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Servicios (2 tarjetas grandes) */}
      <section className={styles.services}>
        <div className={styles.servicesHeading}>
          <div className={`${styles.block} ${styles.servicesHeadingTitle}`} />
          <div className={`${styles.block} ${styles.servicesHeadingSub}`} />
        </div>
        <div className={styles.servicesList}>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className={`${styles.block} ${styles.serviceCard}`} />
          ))}
        </div>
      </section>

      {/* Promo (video + texto) */}
      <section className={styles.promo}>
        <div className={`${styles.block} ${styles.promoMedia}`} />
        <div className={styles.promoCopy}>
          <div className={`${styles.block} ${styles.blockOnDark} ${styles.promoTitle}`} />
          <div className={`${styles.block} ${styles.blockOnDark} ${styles.line}`} />
          <div className={`${styles.block} ${styles.blockOnDark} ${styles.line}`} />
          <div className={`${styles.block} ${styles.blockOnDark} ${styles.line} ${styles.lineShort}`} />
        </div>
      </section>
    </div>
  );
}
