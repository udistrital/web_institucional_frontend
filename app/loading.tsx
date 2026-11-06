import PageLoader from "@/components/common/page-loader/page-loader";

/**
 * Fallback de carga principal del portal.
 *
 * Next.js lo renderiza automaticamente (via Suspense) mientras resuelve la
 * navegacion y los Server Components del segmento raiz, por lo que cubre
 * toda la pagina, incluida la home. Delega la UI en <PageLoader />.
 */
export default function Loading() {
  return <PageLoader />;
}
