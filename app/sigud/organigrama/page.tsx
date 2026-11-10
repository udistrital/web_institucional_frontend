import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import PageHero from "@/components/common/page-hero";
import SectionTabs from "@/components/common/section-tabs/section-tabs";
import DocumentCard, {
  type DocumentKind,
} from "@/components/common/document-card/document-card";
import { SectionIcon } from "./icons";
import {
  SECTIONS,
  ORGANIGRAMAS,
  type DocumentoOrganigrama,
  type SectionId,
} from "./content";

export const metadata: Metadata = {
  title: "Organización funcional",
  description:
    "Consulta los organigramas institucionales de la Universidad Distrital Francisco José de Caldas: General, General Transitorio, Académico y Administrativo.",
};

/** Mapea el tipo de documento del organigrama al formato de DocumentCard. */
function tipoADocumentKind(tipo: DocumentoOrganigrama["tipo"]): DocumentKind {
  return tipo === "pdf" ? "pdf" : "pptx";
}

export default function OrganizacionFuncionalPage() {
  const panels = ORGANIGRAMAS.reduce<Record<SectionId, ReactNode>>(
    (acc, organigrama) => {
      acc[organigrama.id] = (
        <article
          className={styles.block}
          aria-labelledby={`${organigrama.id}-title`}
        >
          {/* El encabezado va fuera de la tarjeta blanca, directo sobre el
              fondo del panel (misma estructura que "Sobre nosotros"). */}
          <div className={styles.sectionHeading}>
            <span className={styles.sectionHeadingIcon} aria-hidden="true">
              <SectionIcon id={organigrama.id} />
            </span>
            <div>
              <p className={styles.sectionKicker}>{organigrama.kicker}</p>
              <h2 id={`${organigrama.id}-title`}>{organigrama.titulo}</h2>
            </div>
          </div>

          <div className={styles.organigrama}>
            {/* Visor embebido del PDF, solo en el primer organigrama (General).
                La relación de aspecto deja ver la página completa sin recortes. */}
            {(() => {
              if (organigrama.id !== "general") return null;
              const pdf = organigrama.documentos.find((d) => d.tipo === "pdf");
              if (!pdf) return null;
              return (
                <div className={styles.pdfViewer}>
                  <iframe
                    className={styles.pdfFrame}
                    src={`${pdf.url}#view=FitH`}
                    title={`Vista previa de ${organigrama.titulo}`}
                    loading="lazy"
                  />
                </div>
              );
            })()}

            {organigrama.descripcion?.map((parrafo, index) => (
              <p className={styles.descripcion} key={index}>
                {parrafo}
              </p>
            ))}

            <h3 className={styles.subheading}>Documentos disponibles</h3>

            <ul className={styles.documentos}>
              {organigrama.documentos.map((documento) => (
                <li key={documento.url}>
                  <DocumentCard
                    label={documento.label}
                    href={documento.url}
                    kind={tipoADocumentKind(documento.tipo)}
                  />
                </li>
              ))}
            </ul>
          </div>
        </article>
      );
      return acc;
    },
    {} as Record<SectionId, ReactNode>,
  );

  return (
    <section className={styles.page} aria-label="Organización funcional">
      <PageHero
        data={{
          title: [
            { text: "Organización ", accent: false },
            { text: "funcional", accent: true },
          ],
          imageUrl: "/image/hero.jpeg",
          imageAlt:
            "Campus de la Universidad Distrital Francisco José de Caldas",
        }}
      />

      <BreadCrumbs variant="onDark" />

      <SectionTabs
        sections={SECTIONS.map((s) => ({
          ...s,
          icon: <SectionIcon id={s.id} />,
        }))}
        panels={panels}
        ariaLabel="Organigramas institucionales"
        contentClassName={styles.content}
      />
    </section>
  );
}
