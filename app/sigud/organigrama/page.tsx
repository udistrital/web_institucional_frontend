import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import SectionTabs from "@/components/common/section-tabs/section-tabs";
import Button from "@/components/common/button/button";
import DocumentCard, {
  type DocumentKind,
} from "@/components/common/document-card/document-card";
import { SectionIcon } from "./icons";
import {
  SECTIONS,
  ORGANIGRAMAS,
  DIRECTORIO_INSTITUCIONAL,
  type DocumentoOrganigrama,
  type SectionId,
} from "./content";

export const metadata: Metadata = {
  title: "Organización funcional",
  description:
    "Consulta los organigramas institucionales de la Universidad Distrital Francisco José de Caldas: General, General Transitorio, Académico y Administrativo.",
};

/** Icono de enlace externo, usado en el enlace al directorio institucional. */
function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

/** Mapea el tipo de documento del organigrama al formato de DocumentCard. */
function tipoADocumentKind(tipo: DocumentoOrganigrama["tipo"]): DocumentKind {
  return tipo === "pdf" ? "pdf" : "pptx";
}

export default function OrganizacionFuncionalPage() {
  const panels = ORGANIGRAMAS.reduce<Record<SectionId, ReactNode>>(
    (acc, organigrama) => {
      acc[organigrama.id] = (
        <article
          className={styles.organigrama}
          aria-labelledby={`${organigrama.id}-title`}
        >
          <div className={styles.sectionHeading}>
            <span className={styles.sectionHeadingIcon} aria-hidden="true">
              <SectionIcon id={organigrama.id} />
            </span>
            <div>
              <p className={styles.sectionKicker}>{organigrama.kicker}</p>
              <h2 id={`${organigrama.id}-title`}>{organigrama.titulo}</h2>
            </div>
          </div>

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

          <div className={styles.directorio}>
            <p className={styles.directorioTexto}>
              {DIRECTORIO_INSTITUCIONAL.texto}
            </p>
            <Button
              href={DIRECTORIO_INSTITUCIONAL.url}
              variant="red"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon />
              {DIRECTORIO_INSTITUCIONAL.label}
            </Button>
          </div>
        </article>
      );
      return acc;
    },
    {} as Record<SectionId, ReactNode>,
  );

  return (
    <section className={styles.page} aria-label="Organización funcional">
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
