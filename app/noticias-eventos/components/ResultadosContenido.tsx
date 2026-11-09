import ContentCard, { type ContentCardItem } from "@/components/common/content-card";
import styles from "../page.module.css";

type ResultadosContenidoProps = {
  total: number;
  itemsFiltrados: ContentCardItem[];
  onLimpiar: () => void;
};

export default function ResultadosContenido({
  total,
  itemsFiltrados,
  onLimpiar,
}: ResultadosContenidoProps) {
  return (
    <section aria-labelledby="resultados-contenido-title">
      <div className={styles.resultsHeading}>
        <h2 id="resultados-contenido-title">Publicaciones</h2>
        <p className={styles.resultCount} aria-live="polite">
          {itemsFiltrados.length}{" "}
          {itemsFiltrados.length === 1 ? "resultado" : "resultados"}
        </p>
      </div>

      {total === 0 ? (
        <div className={styles.statusMessage} role="alert">
          <h3>Contenido no disponible</h3>
          <p>
            No fue posible consultar las noticias y eventos en este momento.
            Intenta de nuevo más tarde.
          </p>
        </div>
      ) : itemsFiltrados.length ? (
        <ul className={styles.grid}>
          {itemsFiltrados.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              <ContentCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.statusMessage}>
          <h3>No encontramos contenido con esos filtros</h3>
          <p>Prueba con otro tipo, año o término de búsqueda.</p>
          <button className={styles.inlineReset} onClick={onLimpiar} type="button">
            Ver todo el contenido
          </button>
        </div>
      )}
    </section>
  );
}
