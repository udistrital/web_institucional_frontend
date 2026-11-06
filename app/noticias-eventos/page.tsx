import type { Metadata } from "next";
import { Suspense } from "react";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import ContenidoCatalogo from "./components/ContenidoCatalogo";
import { cargarContenido } from "./lib/datos";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Noticias y eventos | Universidad Distrital Francisco José de Caldas",
  description:
    "Mantente al día con las noticias y los próximos eventos de la Universidad Distrital Francisco José de Caldas.",
};

export default async function NoticiasEventosPage() {
  const items = await cargarContenido();

  return (
    <main className={styles.page}>
      <BreadCrumbs variant="onDark" />

      <Suspense
        fallback={
          <div aria-busy="true" className={styles.catalogFallback}>
            Cargando noticias y eventos…
          </div>
        }
      >
        <ContenidoCatalogo items={items} />
      </Suspense>
    </main>
  );
}
