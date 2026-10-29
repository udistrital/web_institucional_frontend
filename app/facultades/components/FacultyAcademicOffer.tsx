"use client";

import Image from "next/image";
import { useState } from "react";
import { slugFiltro } from "@/lib/filtros";
import styles from "./faculty-academic-offer.module.css";

export type FacultyAcademicData = {
  title: string;
  imageUrl: string | null;
  imageAlt: string;
};

export type FacultyProgram = {
  id: string;
  nombre: string;
  nivel: string | null;
  modalidad: string | null;
  jornada: string | null;
  snies: number | null;
  acreditacionAltaCalidad: boolean;
  imagenUrl: string | null;
  imagenAlt: string;
  paginaProgramaUrl: string | null;
};

export type AcademicLevel = {
  name: string;
  programs: FacultyProgram[];
};

type FacultyAcademicOfferProps = {
  faculty: FacultyAcademicData;
  levels: AcademicLevel[];
  noDisponible: boolean;
};

function programImage(program: FacultyProgram, faculty: FacultyAcademicData) {
  return program.imagenUrl || faculty.imageUrl;
}

export default function FacultyAcademicOffer({
  faculty,
  levels,
  noDisponible,
}: FacultyAcademicOfferProps) {
  const [activeLevel, setActiveLevel] = useState(0);
  const selectedLevel = levels[activeLevel];
  const facultySlug = slugFiltro(faculty.title);

  if (noDisponible) {
    return (
      <section className={styles.offer} aria-labelledby="faculty-offer-title">
        <div className={styles.statusMessage} role="alert">
          <h2 id="faculty-offer-title">Oferta académica no disponible</h2>
          <p>
            No fue posible consultar los programas en este momento. Intenta de
            nuevo más tarde.
          </p>
        </div>
      </section>
    );
  }

  if (!selectedLevel) {
    return (
      <section className={styles.offer} aria-labelledby="faculty-offer-title">
        <div className={styles.statusMessage} role="status">
          <h2 id="faculty-offer-title">Oferta académica</h2>
          <p>Esta facultad no tiene programas académicos publicados.</p>
        </div>
      </section>
    );
  }

  const tabId = (level: AcademicLevel) =>
    `faculty-tab-${facultySlug}-${slugFiltro(level.name)}`;
  const panelId = (level: AcademicLevel) =>
    `faculty-panel-${facultySlug}-${slugFiltro(level.name)}`;

  return (
    <section className={styles.offer} aria-labelledby="faculty-offer-title">
      <div className={styles.offerHeading}>
        <h2 id="faculty-offer-title">Oferta académica</h2>
      </div>

      <div
        aria-label="Niveles académicos"
        className={styles.tabs}
        role="tablist"
      >
        {levels.map((level, index) => (
          <button
            aria-controls={panelId(level)}
            aria-selected={index === activeLevel}
            className={index === activeLevel ? styles.activeTab : styles.tab}
            id={tabId(level)}
            key={level.name}
            onClick={() => setActiveLevel(index)}
            role="tab"
            type="button"
          >
            {level.name}
          </button>
        ))}
      </div>

      {levels.map((level, index) => {
        const catalogHref = `/nuestra-universidad/oferta-academica?facultad=${facultySlug}&nivel=${slugFiltro(level.name)}`;

        return (
          <div
            aria-labelledby={tabId(level)}
            className={styles.panel}
            hidden={index !== activeLevel}
            id={panelId(level)}
            key={level.name}
            role="tabpanel"
            tabIndex={0}
          >
            <div className={styles.programGrid}>
              {level.programs.slice(0, 4).map((program) => {
                const image = programImage(program, faculty);

                const cardMedia = (
                  <div className={styles.programMedia}>
                    {image ? (
                      <Image
                        alt={program.imagenUrl ? program.imagenAlt : faculty.imageAlt}
                        className={styles.programImage}
                        fill
                        sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 25vw"
                        src={image}
                      />
                    ) : (
                      <span aria-hidden="true" className={styles.programFallback}>
                        {program.nombre.charAt(0)}
                      </span>
                    )}
                    <h3 className={styles.programTitle}>{program.nombre}</h3>
                    {(program.jornada || program.modalidad) && (
                      <div className={styles.programReveal}>
                        <dl className={styles.programDetails}>
                          {program.jornada && (
                            <div>
                              <dt>Jornada</dt>
                              <dd>{program.jornada}</dd>
                            </div>
                          )}
                          {program.modalidad && (
                            <div>
                              <dt>Modalidad</dt>
                              <dd>{program.modalidad}</dd>
                            </div>
                          )}
                        </dl>
                      </div>
                    )}
                  </div>
                );

                return program.paginaProgramaUrl ? (
                  <a
                    aria-label={program.nombre}
                    className={styles.programCard}
                    href={program.paginaProgramaUrl}
                    key={program.id}
                  >
                    {cardMedia}
                  </a>
                ) : (
                  <article className={styles.programCard} key={program.id}>
                    {cardMedia}
                  </article>
                );
              })}
            </div>

            {level.programs.length > 4 && (
              <a
                className={styles.moreLink}
                href={catalogHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ver todas las propuestas
              </a>
            )}
          </div>
        );
      })}
    </section>
  );
}
