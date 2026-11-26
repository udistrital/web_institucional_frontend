import type { Metadata } from "next";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import PageHero from "@/components/common/page-hero";
import TransparenciaMosaico from "./transparencia-mosaico";
import { LEYES } from "./content";

export const metadata: Metadata = {
  title: "Transparencia y acceso a la información pública",
  description:
    "Consulta la información pública de la Universidad Distrital Francisco José de Caldas, publicada en cumplimiento de la Ley 1712 de 2014: el esquema de la Resolución 3564 de 2015 (antigua) y el de la Resolución 1519 de 2020 de MinTIC (nueva).",
};

export default function TransparenciaPage() {
  return (
    <section
      className={styles.page}
      aria-label="Transparencia y acceso a la información pública"
    >
      <PageHero
        data={{
          title: [
            { text: "Transparencia", accent: false },
            { text: " y acceso a la información pública", accent: true },
          ],
          imageUrl: "/image/hero.jpeg",
          imageAlt:
            "Campus de la Universidad Distrital Francisco José de Caldas",
        }}
      />

      <BreadCrumbs variant="onDark" />

      <div className={styles.content}>
        {/* Bloque fijo del marco legal: la Ley 1712 de 2014 no cambia con el
            conmutador, por eso es contenido estático en el server component. */}
        <div className={styles.intro}>
          <p className={styles.introKicker}>Ley 1712 de 2014</p>
          <p className={styles.introText}>
            La Ley 1712 de 2014 es la Ley de Transparencia y del Derecho de
            Acceso a la Información Pública Nacional. En cumplimiento de ella, la
            Universidad Distrital Francisco José de Caldas publica su información
            pública para que cualquier persona pueda consultarla. A
            continuación puedes revisarla según el esquema de la resolución de
            MinTIC correspondiente.
          </p>
        </div>

        <TransparenciaMosaico leyes={LEYES} />
      </div>
    </section>
  );
}
