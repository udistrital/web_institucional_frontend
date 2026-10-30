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
  const availableLevels = levels.filter((level) => level.programs.length > 0);
  const selectedLevel = availableLevels[activeLevel];
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
  const handleTabKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % availableLevels.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + availableLevels.length) % availableLevels.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = availableLevels.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    setActiveLevel(nextIndex);
    document.getElementById(tabId(availableLevels[nextIndex]))?.focus();
  };

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
        {availableLevels.map((level, index) => (
          <button
            aria-controls={panelId(level)}
            aria-selected={index === activeLevel}
            className={index === activeLevel ? styles.activeTab : styles.tab}
            id={tabId(level)}
            key={level.name}
            onClick={() => setActiveLevel(index)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            role="tab"
            tabIndex={index === activeLevel ? 0 : -1}
            type="button"
          >
            {level.name}
          </button>
        ))}
      </div>

      {availableLevels.map((level, index) => {
        const catalogHref = `/nuestra-universidad/oferta-academica?facultad=${facultySlug}&nivel=${slugFiltro(level.name)}`;
        const visiblePrograms = level.programs.slice(0, 4);
        const programCount = visiblePrograms.length;
        const programGridClass =
          programCount === 1
            ? styles.programGridSingle
            : programCount === 2
              ? styles.programGridTwo
              : programCount === 3
                ? styles.programGridThree
                : styles.programGridFour;

        return (
          <div
            aria-hidden={index !== activeLevel}
            aria-labelledby={tabId(level)}
            className={styles.panel}
            hidden={index !== activeLevel}
            id={panelId(level)}
            key={level.name}
            role="tabpanel"
            tabIndex={0}
          >
            <div className={`${styles.programGrid} ${programGridClass}`}>
              {visiblePrograms.map((program) => {
                const image = programImage(program, faculty);
                const isFeatured = programCount === 1;
                const imageSizes = isFeatured
                  ? "(max-width: 680px) 100vw, (max-width: 1050px) 50vw, 55vw"
                  : programCount === 2
                    ? "(max-width: 680px) 100vw, (max-width: 1050px) 50vw, (max-width: 1300px) 45vw, 34rem"
                    : programCount === 3
                      ? "(max-width: 680px) 100vw, (max-width: 1050px) 50vw, 33vw"
                      : "(max-width: 680px) 100vw, (max-width: 1050px) 50vw, 25vw";
                const mediaImage = image ? (
                  <Image
                    alt={program.imagenUrl ? program.imagenAlt : faculty.imageAlt}
                    className={styles.programImage}
                    fill
                    sizes={imageSizes}
                    src={image}
                  />
                ) : (
                  <span
                    aria-label={`Imagen no disponible de ${program.nombre}`}
                    className={styles.programFallback}
                    role="img"
                  >
                    <span aria-hidden="true">{program.nombre.charAt(0)}</span>
                  </span>
                );
                const cardMedia = isFeatured ? (
                  <div className={styles.featuredMedia}>
                    <div className={styles.featuredImage}>{mediaImage}</div>
                    <div className={styles.featuredContent}>
                      <p className={styles.featuredLevel}>
                        {program.nivel || level.name}
                      </p>
                      <h3 className={styles.featuredTitle}>{program.nombre}</h3>
                      <dl className={styles.featuredDetails}>
                        {program.modalidad && (
                          <div>
                            <dt>Modalidad</dt>
                            <dd>{program.modalidad}</dd>
                          </div>
                        )}
                        {program.jornada && (
                          <div>
                            <dt>Jornada</dt>
                            <dd>{program.jornada}</dd>
                          </div>
                        )}
                        {program.snies !== null && (
                          <div>
                            <dt>SNIES</dt>
                            <dd>{program.snies}</dd>
                          </div>
                        )}
                      </dl>
                      {program.acreditacionAltaCalidad && (
                        <p className={styles.featuredAccreditation}>
                          <span aria-hidden="true">✦</span>
                          Acreditación de Alta Calidad
                        </p>
                      )}
                      {program.paginaProgramaUrl && (
                        <span className={styles.featuredLink}>
                          Conocer programa
                          <span aria-hidden="true"> →</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.programMedia}>
                    {mediaImage}
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
                const cardClass = isFeatured
                  ? `${styles.programCard} ${styles.featuredCard}`
                  : styles.programCard;

                return program.paginaProgramaUrl ? (
                  <a
                    className={cardClass}
                    href={program.paginaProgramaUrl}
                    key={program.id}
                  >
                    {cardMedia}
                  </a>
                ) : (
                  <article
                    className={`${cardClass} ${styles.programCardStatic}`}
                    key={program.id}
                  >
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
