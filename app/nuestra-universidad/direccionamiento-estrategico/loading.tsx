import SectionTabsSkeleton from "../_skeletons/SectionTabsSkeleton";

/**
 * Skeleton de carga de "Direccionamiento estrategico".
 *
 * Next.js lo muestra (via Suspense) mientras resuelve el segmento. Reproduce
 * el layout de pestañas con sus 4 secciones: mision y vision, objetivos,
 * politicas institucionales y normatividad.
 */
export default function Loading() {
  return (
    <SectionTabsSkeleton tabs={4} label="Cargando Direccionamiento estrategico" />
  );
}
