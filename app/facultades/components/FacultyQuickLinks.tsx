import styles from "./faculty-quick-links.module.css";

type FacultyQuickLinksProps = {
  /** Destino de todos los botones mientras no tengan página propia. */
  href: string;
};

/**
 * Ordenadas de mayor a menor largo de texto para formar la pirámide invertida;
 * el ancho de cada fila lo fija su posición en el CSS.
 */
const LABELS = [
  "Currículo y calidad",
  "Procesos SIGUD",
  "Investigación",
  "La facultad",
  "Extensión",
];

/** Botones de secciones de la facultad, bajo el título del hero. */
export default function FacultyQuickLinks({ href }: FacultyQuickLinksProps) {
  return (
    <nav aria-label="Secciones de la facultad" className={styles.nav}>
      <ul className={styles.list}>
        {LABELS.map((label) => (
          <li className={styles.item} key={label}>
            <a className={styles.link} href={href}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
