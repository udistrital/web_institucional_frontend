import type { Metadata } from "next";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import PageHero from "@/components/common/page-hero";
import TransparenciaMosaico from "./transparencia-mosaico";
import { LEYES } from "./content";

export const metadata: Metadata = {
  title: "Transparencia y acceso a la información pública",
  description:
    "Consulta la información pública de la Universidad Distrital Francisco José de Caldas: el esquema de la Ley 1712 de 2014 (13 categorías) y el de la Resolución 1519 de 2020 de MinTIC (10 secciones).",
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
        <TransparenciaMosaico leyes={LEYES} />
      </div>
    </section>
  );
}
