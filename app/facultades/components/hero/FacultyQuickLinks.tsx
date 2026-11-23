import Link from "next/link";
import styles from "./faculty-quick-links.module.css";
import { QuickLinksItem, QuickLinksList } from "./FacultyQuickLinksMotion";

type FacultyQuickLinksProps = {
  /** Destino de todos los botones mientras no tengan página propia. */
  href?: string;
  /** ID del botón activo (ej: "procesos-sigud"). */
  activeId?: string;
  /** Slug de la facultad para construir rutas internas (ej: "ingenieria"). */
  slug?: string;
};

/**
 * Etiquetas con IDs correspondientes.
 * Ordenadas de mayor a menor largo de texto para formar la pirámide invertida;
 * el ancho de cada fila lo fija su posición en el CSS.
 */
const LABELS_WITH_IDS = [
  { id: "curriculo", label: "Currículo y calidad" },
  { id: "procesos-sigud", label: "Procesos SIGUD" },
  { id: "investigacion", label: "Investigación" },
  { id: "la-facultad", label: "La facultad" },
  { id: "extension", label: "Extensión" },
];

/** Botones de secciones de la facultad, bajo el título del hero. */
export default function FacultyQuickLinks({
  href,
  activeId,
  slug,
}: FacultyQuickLinksProps) {
  return (
    <nav aria-label="Secciones de la facultad" className={styles.nav}>
      <QuickLinksList className={styles.list}>
        {LABELS_WITH_IDS.map(({ id, label }) => {
          const isActive = activeId === id;

          // Construir el href según el botón:
          // - "procesos-sigud" → /facultades/<slug>/procesos-sigud
          // - Otros → /facultades/<slug> (página de la facultad)
          let linkHref = href || "#";
          if (slug) {
            if (id === "procesos-sigud") {
              linkHref = `/facultades/${slug}/procesos-sigud`;
            } else {
              linkHref = `/facultades/${slug}`;
            }
          }

          return (
            <QuickLinksItem className={styles.item} key={id}>
              {isActive ? (
                <a
                  className={`${styles.link} ${styles.linkActive}`}
                  href={linkHref}
                  aria-current="page"
                >
                  {label}
                </a>
              ) : (
                <Link href={linkHref} className={styles.link}>
                  {label}
                </Link>
              )}
            </QuickLinksItem>
          );
        })}
      </QuickLinksList>
    </nav>
  );
}
