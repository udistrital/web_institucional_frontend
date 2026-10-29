import type { Metadata } from "next";
import { Suspense } from "react";
import { getFaculties } from "@/services/facultades";
import { cargarOfertaAcademica } from "@/services/oferta-academica";
import OfertaAcademicaCatalogo from "./components/OfertaAcademicaCatalogo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Oferta académica | Universidad Distrital Francisco José de Caldas",
  description:
    "Explora los programas académicos de pregrado y posgrado de la Universidad Distrital Francisco José de Caldas.",
};

export default async function OfertaAcademicaPage() {
  const [oferta, facultades] = await Promise.all([
    cargarOfertaAcademica(),
    getFaculties(),
  ]);

  return (
    <main className={styles.page}>
      <Suspense
        fallback={
          <div aria-busy="true" className={styles.catalogFallback}>
            Cargando programas académicos…
          </div>
        }
      >
        <OfertaAcademicaCatalogo
          facultades={facultades}
          nivelesFiltro={oferta.nivelesFiltro}
          modalidades={oferta.modalidades}
          jornadas={oferta.jornadas}
          noDisponible={oferta.noDisponible}
          programas={oferta.programas}
        />
      </Suspense>
    </main>
  );
}
