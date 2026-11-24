import type { Metadata } from "next";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import PageHero from "@/components/common/page-hero";
import TransparenciaMosaico from "./transparencia-mosaico";
import { CATEGORIAS } from "./content";

export const metadata: Metadata = {
  title: "Transparencia y acceso a la información pública",
  description:
    "Consulta la información pública de la Universidad Distrital Francisco José de Caldas en cumplimiento de la Ley 1712 de 2014: contacto, estructura, presupuesto, planeación, contratación, control y más.",
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
        <div className={styles.intro}>
          <p className={styles.introKicker}>Ley 1712 de 2014</p>
          <p className={styles.introText}>
            La Universidad Distrital Francisco José de Caldas pone a disposición
            de la ciudadanía su información pública, organizada en 13 categorías.
            Selecciona una categoría para ver sus subsecciones y los enlaces a la
            información oficial.
          </p>
        </div>

        <TransparenciaMosaico categorias={CATEGORIAS} />
      </div>
    </section>
  );
}
