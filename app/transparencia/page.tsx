import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import PageHero from "@/components/common/page-hero";
import SectionTabs, {
  type SectionLink,
} from "@/components/common/section-tabs/section-tabs";
import DocumentCard, {
  type DocumentKind,
} from "@/components/common/document-card/document-card";
import TransparenciaMosaico from "./transparencia-mosaico";
import { LEYES } from "./content";
import {
  NORMATIVIDAD_EXTERNA,
  NORMATIVIDAD_INTERNA,
  type NormaTransparencia,
} from "./normatividad-content";
import ComitePanel from "./comite-panel";

type TransparenciaSectionId =
  | "indices"
  | "normatividad"
  | "comite";

const SECTIONS = [
  { id: "indices", label: "Índices de transparencia" },
  { id: "normatividad", label: "Normatividad" },
  { id: "comite", label: "Comité" },
] satisfies SectionLink<TransparenciaSectionId>[];

export const metadata: Metadata = {
  title: "Transparencia y acceso a la información pública",
  description:
    "Consulta la información pública de la Universidad Distrital Francisco José de Caldas, publicada en cumplimiento de la Ley 1712 de 2014: el esquema de la Resolución 3564 de 2015 (antigua) y el de la Resolución 1519 de 2020 de MinTIC (nueva).",
};

function getDocumentKind(url: string): DocumentKind {
  return url.toLowerCase().endsWith(".pdf") ? "pdf" : "enlace";
}

function NormasList({ normas }: { normas: NormaTransparencia[] }) {
  return (
    <ul className={styles.documentos}>
      {normas.map((norma) => (
        <li key={norma.url}>
          <DocumentCard
            label={norma.titulo}
            href={norma.url}
            kind={getDocumentKind(norma.url)}
            description={norma.descripcion}
            meta={`Actualizado el ${norma.actualizacion}`}
            hideArrowOnMobile
          />
        </li>
      ))}
    </ul>
  );
}

function NormatividadPanel() {
  return (
    <article className={styles.detalleInner} aria-label="Normatividad">
      <section
        className={styles.normatividadSection}
        aria-labelledby="normatividad-interna-title"
      >
        <h2
          id="normatividad-interna-title"
          className={styles.normatividadTitulo}
        >
          Normatividad interna
        </h2>
        <NormasList normas={NORMATIVIDAD_INTERNA} />
      </section>

      <section
        className={styles.normatividadSection}
        aria-labelledby="normatividad-externa-title"
      >
        <h2
          id="normatividad-externa-title"
          className={styles.normatividadTitulo}
        >
          Normatividad externa
        </h2>
        {NORMATIVIDAD_EXTERNA.map((grupo) => (
          <section
            className={styles.normatividadGrupo}
            key={grupo.id}
            aria-labelledby={`normatividad-${grupo.id}`}
          >
            <h3
              id={`normatividad-${grupo.id}`}
              className={styles.normatividadGrupoTitulo}
            >
              {grupo.entidad}
            </h3>
            <NormasList normas={grupo.normas} />
          </section>
        ))}
      </section>
    </article>
  );
}

export default function TransparenciaPage() {
  const panels: Record<TransparenciaSectionId, ReactNode> = {
    indices: (
      <>
        <div className={styles.intro}>
          <p className={styles.introKicker}>Ley 1712 de 2014</p>
          <p className={styles.introText}>
            La Ley 1712 de 2014 es la Ley de Transparencia y del Derecho de
            Acceso a la Información Pública Nacional. En cumplimiento de ella,
            la Universidad Distrital Francisco José de Caldas publica su
            información pública para que cualquier persona pueda consultarla. A
            continuación puedes revisarla según el esquema de la resolución de
            MinTIC correspondiente.
          </p>
        </div>
        <TransparenciaMosaico leyes={LEYES} />
      </>
    ),
    normatividad: <NormatividadPanel />,
    comite: <ComitePanel />,
  };

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

      <SectionTabs
        sections={SECTIONS}
        panels={panels}
        ariaLabel="Secciones de transparencia"
        contentClassName={styles.content}
      />
    </section>
  );
}
