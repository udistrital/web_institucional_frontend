import SectionTabsSkeleton from "../_skeletons/SectionTabsSkeleton";

/**
 * Skeleton de carga de "Sobre Nosotros".
 *
 * Next.js lo muestra (via Suspense) mientras resuelve el segmento y los datos
 * de la pagina (p. ej. getRector). Reproduce el layout de pestañas con sus 4
 * secciones: funciones misionales, directivos, historia y simbolos.
 */
export default function Loading() {
  return <SectionTabsSkeleton tabs={4} label="Cargando Sobre Nosotros" />;
}
