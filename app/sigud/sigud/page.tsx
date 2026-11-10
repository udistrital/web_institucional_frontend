import type { Metadata } from "next";
import type { ReactNode } from "react";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import PageHero from "@/components/common/page-hero";
import SectionTabs from "@/components/common/section-tabs/section-tabs";
import DocumentCard from "@/components/common/document-card/document-card";
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

/** Lista de documentos reutilizable (formatos, caracterización, etc.). */
function ListaDocumentos({ documentos }: { documentos: Documento[] }) {
  return (
    <ul className={styles.documentos}>
      {documentos.map((documento) => (
        <li key={documento.url}>
          <DocumentCard
            label={documento.label}
            href={documento.url}
            kind={documento.tipo}
          />
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
      <article className={styles.block} aria-labelledby="presentacion-title">
        <SectionHeading
          id="presentacion"
          kicker={PRESENTACION.kicker}
          titulo={PRESENTACION.titulo}
        />
        <div className={styles.bloque}>
          {PRESENTACION.parrafos.map((parrafo, index) => (
            <p className={styles.descripcion} key={index}>
              {parrafo}
            </p>
          ))}
        </div>
      </article>
    ),

    formatos: (
      <article className={styles.block} aria-labelledby="formatos-title">
        <SectionHeading
          id="formatos"
          kicker="Recursos de apoyo"
          titulo="Formatos y documentos de interés"
        />
        <div className={styles.bloque}>
          {GRUPOS_DOCUMENTOS.map((grupo) => (
            <section className={styles.grupo} key={grupo.titulo}>
              <h3 className={styles.subheading}>{grupo.titulo}</h3>
              {grupo.descripcion ? (
                <p className={styles.descripcion}>{grupo.descripcion}</p>
              ) : null}
              <ListaDocumentos documentos={grupo.documentos} />
            </section>
          ))}
        </div>
      </article>
    ),

    modelo: (
      <article className={styles.block} aria-labelledby="modelo-title">
        <SectionHeading
          id="modelo"
          kicker="Operación por procesos"
          titulo="Modelo de Operación por Procesos"
        />
        <div className={styles.bloque}>
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
                  className={styles.accesoLink}
                  href={acceso.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className={styles.accesoFlecha} aria-hidden="true">
                    <ExternalLinkIcon />
                  </span>
                  <span className={styles.accesoBody}>
                    <span className={styles.accesoLabel}>{acceso.label}</span>
                    <span className={styles.accesoDesc}>
                      {acceso.descripcion}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </article>
    ),

    normatividad: (
      <article className={styles.block} aria-labelledby="normatividad-title">
        <SectionHeading
          id="normatividad"
          kicker="Marco normativo"
          titulo="Normatividad del Subsistema de Gestión de Calidad (SGC)"
        />
        <div className={styles.bloque}>
          <ul className={styles.normas}>
            {NORMATIVIDAD.map((norma) => (
              <li key={norma.url}>
                <DocumentCard
                  label={norma.label}
                  href={norma.url}
                  kind={
                    norma.url.toLowerCase().endsWith(".pdf") ? "pdf" : "enlace"
                  }
                  description={norma.descripcion}
                />
              </li>
            ))}
          </ul>
        </div>
      </article>
    ),
  };

  return (
    <section className={styles.page} aria-label="Sistema Integrado de Gestión (SIGUD)">
      <PageHero
        data={{
          title: [
            { text: "Sistema Integrado de ", accent: false },
            { text: "Gestión", accent: true },
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
        ariaLabel="Secciones del Sistema Integrado de Gestión"
        contentClassName={styles.content}
      />
    </section>
  );
}
