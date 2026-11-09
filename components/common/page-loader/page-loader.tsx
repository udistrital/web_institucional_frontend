import styles from "./page-loader.module.css";

type PageLoaderProps = {
  /**
   * Texto accesible/visible que acompana al escudo. Por defecto anuncia
   * que la pagina esta cargando. Personalizable para reutilizar el loader
   * en secciones concretas.
   */
  label?: string;
};

/**
 * Pantalla de carga principal del portal.
 *
 * Pensada para usarse desde `app/loading.tsx` (fallback global de Next.js),
 * cubre todo el viewport con el escudo institucional animado y una barra
 * de progreso indeterminada. Expone `role="status"` + `aria-live` para que
 * los lectores de pantalla anuncien el estado de carga.
 */
export default function PageLoader({
  label = "Cargando la pagina",
}: PageLoaderProps) {
  return (
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className={styles.content}>
        <div className={styles.shieldWrap}>
          <img
            src="/escudos/escudo-ud-black.svg"
            alt=""
            aria-hidden="true"
            className={styles.shield}
          />
        </div>

        <p className={styles.label}>{label}</p>

        <div className={styles.track} aria-hidden="true">
          <span className={styles.bar} />
        </div>

        <span className="sr-only">{label}, espere un momento.</span>
      </div>
    </div>
  );
}
