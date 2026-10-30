import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import BreadCrumbs from "@/components/common/bread-crumbs/bread-crumbs";
import SectionTabs from "@/components/common/section-tabs/section-tabs";
import NormatividadBrowser from "./normatividad-browser";
import { SectionIcon } from "./icons";
import {
  SECTIONS,
  MISION_VISION,
  MISION_VISION_ACTUALIZADO,
  OBJETIVOS,
  OBJETIVOS_ACTUALIZADO,
  POLITICAS,
  NORMATIVIDAD,
} from "./content";

export const metadata: Metadata = {
  title: "Direccionamiento estratégico",
  description:
    "Conoce la misión, la visión, los objetivos, las políticas institucionales y la normatividad de la Universidad Distrital Francisco José de Caldas.",
};

export default function DireccionamientoEstrategicoPage() {
  /* 1. Misión y visión */
  const misionVisionPanel: ReactNode = (
    <article className={styles.block} aria-labelledby="mision-vision-title">
      <div className={styles.sectionHeading}>
        <span className={styles.sectionHeadingIcon} aria-hidden="true">
          <SectionIcon id="mision-vision" />
        </span>
        <div>
          <p className={styles.sectionKicker}>Nuestro rumbo</p>
          <h2 id="mision-vision-title">Misión y visión</h2>
        </div>
      </div>

      <p className={styles.actualizado}>{MISION_VISION_ACTUALIZADO}</p>

      <div className={styles.declaracionesGrid}>
        {MISION_VISION.map((declaracion) => (
          <article className={styles.declaracionCard} key={declaracion.titulo}>
            <div className={styles.declaracionMedia}>
              <Image
                src={declaracion.imagen}
                alt={declaracion.imagenAlt}
                fill
                sizes="(max-width: 820px) 100vw, 36rem"
                className={styles.declaracionImg}
              />
            </div>
            <div className={styles.declaracionBody}>
              <h3>{declaracion.titulo}</h3>
              <p>{declaracion.texto}</p>
            </div>
          </article>
        ))}
      </div>
    </article>
  );

  /* 2. Objetivos */
  const objetivosPanel: ReactNode = (
    <article className={styles.block} aria-labelledby="objetivos-title">
      <div className={styles.sectionHeading}>
        <span className={styles.sectionHeadingIcon} aria-hidden="true">
          <SectionIcon id="objetivos" />
        </span>
        <div>
          <p className={styles.sectionKicker}>Nuestros propósitos</p>
          <h2 id="objetivos-title">Objetivos</h2>
        </div>
      </div>

      <p className={styles.actualizado}>{OBJETIVOS_ACTUALIZADO}</p>

      <ol className={styles.objetivosList}>
        {OBJETIVOS.map((objetivo, index) => (
          <li className={styles.objetivoItem} key={index}>
            <span className={styles.objetivoNumero} aria-hidden="true">
              {index + 1}
            </span>
            <p>{objetivo}</p>
          </li>
        ))}
      </ol>
    </article>
  );

  /* 3. Políticas institucionales */
  const politicasPanel: ReactNode = (
    <article className={styles.block} aria-labelledby="politicas-title">
      <div className={styles.sectionHeading}>
        <span className={styles.sectionHeadingIcon} aria-hidden="true">
          <SectionIcon id="politicas-institucionales" />
        </span>
        <div>
          <p className={styles.sectionKicker}>Marco de actuación</p>
          <h2 id="politicas-title">Políticas institucionales</h2>
        </div>
      </div>

      <ul className={styles.politicasGrid}>
        {POLITICAS.map((politica) => (
          <li className={styles.politicaCard} key={politica.titulo}>
            <div className={styles.politicaBody}>
              <h3 className={styles.politicaTitulo}>{politica.titulo}</h3>
              {politica.descripcion && (
                <p className={styles.politicaDesc}>{politica.descripcion}</p>
              )}
            </div>
            <a
              className={styles.politicaLink}
              href={politica.documentoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
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
              Ver documento
              <span className={styles.sr}>
                {" "}
                de {politica.titulo}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </article>
  );

  /* 4. Normatividad */
  const normatividadPanel: ReactNode = (
    <article className={styles.block} aria-labelledby="normatividad-title">
      <div className={styles.sectionHeading}>
        <span className={styles.sectionHeadingIcon} aria-hidden="true">
          <SectionIcon id="normatividad" />
        </span>
        <div>
          <p className={styles.sectionKicker}>Marco legal</p>
          <h2 id="normatividad-title">Normatividad</h2>
        </div>
      </div>

      <NormatividadBrowser grupos={NORMATIVIDAD} />
    </article>
  );

  const panels: Record<string, ReactNode> = {
    "mision-vision": misionVisionPanel,
    objetivos: objetivosPanel,
    "politicas-institucionales": politicasPanel,
    normatividad: normatividadPanel,
  };

  return (
    <section className={styles.page} aria-label="Direccionamiento estratégico">
      <BreadCrumbs variant="onDark" />

      <SectionTabs
        sections={SECTIONS.map((s) => ({
          ...s,
          icon: <SectionIcon id={s.id} />,
        }))}
        panels={panels}
        ariaLabel="Secciones de Direccionamiento estratégico"
        contentClassName={styles.content}
      />
    </section>
  );
}
