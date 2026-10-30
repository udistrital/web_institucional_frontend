import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import SectionTabs from "@/components/common/section-tabs/section-tabs";
import { SectionIcon } from "./icons";
import {
  SECTIONS,
  PRESENTACION,
  GRUPOS_DOCUMENTOS,
  MODELO_VIDEO,
  ACCESOS_PLATAFORMA,
  NORMATIVIDAD,
  type Documento,
  type SectionId,
} from "./content";

export const metadata: Metadata = {
  title: "Sistema Integrado de Gestión (SIGUD)",
  description:
    "Conoce el Sistema Integrado de Gestión de la Universidad Distrital Francisco José de Caldas (SIGUD): formatos y documentos de interés, modelo de operación por procesos y normatividad del Subsistema de Gestión de Calidad.",
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

/** Icono representativo del formato del documento (PDF, DOC o enlace). */
function DocumentoIcono({ tipo }: { tipo: Documento["tipo"] }) {
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
      {tipo === "enlace" ? (
        <>
          <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
        </>
      ) : (
        <>
          <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <path d="M14 3v6h6" />
          {tipo === "pdf" ? (
            <path d="M8 13h8M8 17h5" />
          ) : (
            <path d="M8 13h8M8 17h8M8 9h3" />
          )}
        </>
      )}
    </svg>
  );
}

/** Etiqueta descriptiva del tipo de recurso mostrada bajo el enlace. */
function tipoLabel(tipo: Documento["tipo"]): string {
  switch (tipo) {
    case "pdf":
      return "Documento PDF";
    case "doc":
      return "Documento Word";
    default:
      return "Enlace externo";
  }
}

/** Clase del badge de color según el formato del recurso. */
function tipoClass(tipo: Documento["tipo"]): string {
  switch (tipo) {
    case "pdf":
      return styles.tipoPdf;
    case "doc":
      return styles.tipoDoc;
    default:
      return styles.tipoEnlace;
  }
}

/** Lista de documentos reutilizable (formatos, caracterización, etc.). */
function ListaDocumentos({ documentos }: { documentos: Documento[] }) {
  return (
    <ul className={styles.documentos}>
      {documentos.map((documento) => (
        <li key={documento.url}>
          <a
            className={styles.documentoCard}
            href={documento.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className={`${styles.documentoIcono} ${tipoClass(documento.tipo)}`}
              aria-hidden="true"
            >
              <DocumentoIcono tipo={documento.tipo} />
            </span>
            <span className={styles.documentoBody}>
              <span className={styles.documentoLabel}>{documento.label}</span>
              <span className={styles.documentoTipo}>
                {tipoLabel(documento.tipo)}
              </span>
            </span>
            <span className={styles.documentoFlecha} aria-hidden="true">
              <ExternalLinkIcon />
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Encabezado de sección (icono + antetítulo + título). */
function SectionHeading({
  id,
  kicker,
  titulo,
}: {
  id: SectionId;
  kicker: string;
  titulo: string;
}) {
  return (
    <div className={styles.sectionHeading}>
      <span className={styles.sectionHeadingIcon} aria-hidden="true">
        <SectionIcon id={id} />
      </span>
      <div>
        <p className={styles.sectionKicker}>{kicker}</p>
        <h2 id={`${id}-title`}>{titulo}</h2>
      </div>
    </div>
  );
}

export default function SigudPage() {
  const panels: Record<SectionId, ReactNode> = {
    presentacion: (
      <article
        className={styles.bloque}
        aria-labelledby="presentacion-title"
      >
        <SectionHeading
          id="presentacion"
          kicker={PRESENTACION.kicker}
          titulo={PRESENTACION.titulo}
        />
        {PRESENTACION.parrafos.map((parrafo, index) => (
          <p className={styles.descripcion} key={index}>
            {parrafo}
          </p>
        ))}
      </article>
    ),

    formatos: (
      <article className={styles.bloque} aria-labelledby="formatos-title">
        <SectionHeading
          id="formatos"
          kicker="Recursos de apoyo"
          titulo="Formatos y documentos de interés"
        />
        {GRUPOS_DOCUMENTOS.map((grupo) => (
          <section className={styles.grupo} key={grupo.titulo}>
            <h3 className={styles.subheading}>{grupo.titulo}</h3>
            {grupo.descripcion ? (
              <p className={styles.descripcion}>{grupo.descripcion}</p>
            ) : null}
            <ListaDocumentos documentos={grupo.documentos} />
          </section>
        ))}
      </article>
    ),

    modelo: (
      <article className={styles.bloque} aria-labelledby="modelo-title">
        <SectionHeading
          id="modelo"
          kicker="Operación por procesos"
          titulo="Modelo de Operación por Procesos"
        />

        <h3 className={styles.subheading}>{MODELO_VIDEO.titulo}</h3>
        <p className={styles.descripcion}>{MODELO_VIDEO.descripcion}</p>
        <div className={styles.videoWrapper}>
          <iframe
            className={styles.videoFrame}
            src={MODELO_VIDEO.embedUrl}
            title={MODELO_VIDEO.titulo}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <h3 className={styles.subheading}>Accesos y plataforma</h3>
        <ul className={styles.accesos}>
          {ACCESOS_PLATAFORMA.map((acceso) => (
            <li key={acceso.url}>
              <a
                className={styles.accesoCard}
                href={acceso.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className={styles.accesoBody}>
                  <span className={styles.accesoLabel}>{acceso.label}</span>
                  <span className={styles.accesoDesc}>{acceso.descripcion}</span>
                </span>
                <span className={styles.accesoFlecha} aria-hidden="true">
                  <ExternalLinkIcon />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </article>
    ),

    normatividad: (
      <article className={styles.bloque} aria-labelledby="normatividad-title">
        <SectionHeading
          id="normatividad"
          kicker="Marco normativo"
          titulo="Normatividad del Subsistema de Gestión de Calidad (SGC)"
        />
        <ul className={styles.normas}>
          {NORMATIVIDAD.map((norma) => (
            <li className={styles.norma} key={norma.url}>
              <a
                className={styles.normaLink}
                href={norma.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLinkIcon />
                {norma.label}
              </a>
              <p className={styles.normaTexto}>{norma.descripcion}</p>
            </li>
          ))}
        </ul>
      </article>
    ),
  };

  return (
    <section className={styles.page} aria-label="Sistema Integrado de Gestión (SIGUD)">
      <BreadCrumbs variant="onDark" />

      <SectionTabs
        sections={SECTIONS.map((s) => ({
          ...s,
          icon: <SectionIcon id={s.id} />,
        }))}
        panels={panels}
        ariaLabel="Secciones del Sistema Integrado de Gestión"
        contentClassName={styles.content}
      />
    </section>
  );
}
