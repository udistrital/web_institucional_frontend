import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import SectionTabs from "@/components/common/section-tabs/section-tabs";
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

/** Icono de enlace externo, reutilizado en los enlaces a documentos. */
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

/** Icono representativo del formato del documento (PDF o PPTX). */
function DocumentoIcono({ tipo }: { tipo: DocumentoOrganigrama["tipo"] }) {
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
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6" />
      {tipo === "pdf" ? (
        <path d="M8 13h8M8 17h5" />
      ) : (
        <path d="M9 13h3a1.5 1.5 0 0 1 0 3H9zM9 13v6" />
      )}
    </svg>
  );
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

          {/* Prueba de visualización: visor embebido del PDF, solo en el
              primer organigrama (General). */}
          {(() => {
            if (organigrama.id !== "general") return null;
            const pdf = organigrama.documentos.find((d) => d.tipo === "pdf");
            if (!pdf) return null;
            return (
              <div className={styles.pdfViewer}>
                <iframe
                  className={styles.pdfFrame}
                  src={pdf.url}
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
                <a
                  className={styles.documentoCard}
                  href={documento.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    className={`${styles.documentoIcono} ${
                      documento.tipo === "pdf" ? styles.tipoPdf : styles.tipoPptx
                    }`}
                    aria-hidden="true"
                  >
                    <DocumentoIcono tipo={documento.tipo} />
                  </span>
                  <span className={styles.documentoBody}>
                    <span className={styles.documentoLabel}>
                      {documento.label}
                    </span>
                    <span className={styles.documentoTipo}>
                      {documento.tipo === "pdf"
                        ? "Documento PDF"
                        : "Presentación PowerPoint"}
                    </span>
                  </span>
                  <span className={styles.documentoFlecha} aria-hidden="true">
                    <ExternalLinkIcon />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className={styles.directorio}>
            <p className={styles.directorioTexto}>
              {DIRECTORIO_INSTITUCIONAL.texto}
            </p>
            <a
              className={styles.directorioLink}
              href={DIRECTORIO_INSTITUCIONAL.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon />
              {DIRECTORIO_INSTITUCIONAL.label}
            </a>
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
