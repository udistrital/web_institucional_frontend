import type { Faculty } from "@/services/facultades";
import type { ProgramaAcademico } from "@/services/oferta-academica";
import { slugFiltro } from "../lib/filtros";
import FichaPrograma from "./FichaPrograma";
import styles from "../page.module.css";

type ResultadosOfertaAcademicaProps = {
  programas: ProgramaAcademico[];
  programasFiltrados: ProgramaAcademico[];
  facultades: Faculty[];
  noDisponible: boolean;
  onLimpiar: () => void;
};

export default function ResultadosOfertaAcademica({
  programas,
  programasFiltrados,
  facultades,
  noDisponible,
  onLimpiar,
}: ResultadosOfertaAcademicaProps) {
  return (
    <section className={styles.results} aria-labelledby="programas-title">
      <div className={styles.resultsHeading}>
        <div>
          <h2 id="programas-title">Programas académicos</h2>
        </div>
        {!noDisponible && (
          <p className={styles.resultCount} aria-live="polite">
            {programasFiltrados.length} {programasFiltrados.length === 1 ? "programa" : "programas"}
          </p>
        )}
      </div>

      {noDisponible ? (
        <div className={styles.statusMessage} role="alert">
          <h3>Oferta académica no disponible</h3>
          <p>No fue posible consultar los programas en este momento. Intenta de nuevo más tarde.</p>
        </div>
      ) : programas.length === 0 ? (
        <div className={styles.statusMessage}>
          <h3>Aún no hay programas publicados</h3>
          <p>
            Drupal respondió correctamente, pero todavía no hay nodos publicados
            en el tipo de contenido de oferta académica.
          </p>
        </div>
      ) : programasFiltrados.length ? (
        <div className={styles.programList}>
          {programasFiltrados.map((programa) => (
            <FichaPrograma
              key={programa.id}
              facultadImagen={
                facultades.find(
                  (facultad) =>
                    slugFiltro(facultad.title) === slugFiltro(programa.facultad),
                ) ?? null
              }
              programa={programa}
            />
          ))}
        </div>
      ) : (
        <div className={styles.statusMessage}>
          <h3>No encontramos programas con esos filtros</h3>
          <p>Prueba con otro nivel, facultad o término de búsqueda.</p>
          <button className={styles.inlineReset} onClick={onLimpiar} type="button">
            Ver todos los programas
          </button>
        </div>
      )}
    </section>
  );
}
