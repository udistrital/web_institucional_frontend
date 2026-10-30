"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./home.module.css";
import { useSwipe } from "./useSwipe";
import type { Faculty } from "@/types/domain";

type FacultiesSectionProps = {
  faculties?: Faculty[] | null;
};

function isRenderableFaculty(faculty: Faculty | null | undefined): faculty is Faculty {
  return Boolean(faculty?.title && faculty?.href);
}

export default function FacultiesSection({ faculties }: FacultiesSectionProps) {
  const [start, setStart] = useState(0);
  const availableFaculties = (Array.isArray(faculties) ? faculties : []).filter(isRenderableFaculty);
  const facultyCount = availableFaculties.length;
  const move = (step: number) => {
    setStart((current) => {
      if (facultyCount === 0) return 0;
      return (current % facultyCount + step + facultyCount) % facultyCount;
    });
  };
  const swipe = useSwipe(move);
  const activeStart = facultyCount > 0 ? start % facultyCount : 0;
  const visible = facultyCount > 0
    ? Array.from({ length: 3 }, (_, index) => availableFaculties[(activeStart + index) % facultyCount])
    : [];

  if (facultyCount === 0) {
    return (
      <section className={styles["faculties-section"]} aria-labelledby="faculties-title">
        <div className={styles["faculties-intro"]}>
          <h2 id="faculties-title">Nuestras Facultades</h2>
          <Link className={styles["faculties-link"]} href="/facultades">Ver facultades</Link>
        </div>
        <div className={styles["faculties-empty-state"]} role="status" aria-live="polite">
          <h3>Información no disponible</h3>
          <p>No fue posible cargar la información de las facultades.</p>
        </div>
      </section>
    );
  }

  if (!faculties.length) {
    return (
      <section className={styles["faculties-section"]} aria-labelledby="faculties-title">
        <div className={styles["faculties-intro"]}>
          <h2 id="faculties-title">Nuestras Facultades</h2>
          <Link className={styles["faculties-link"]} href="/facultades">Ver facultades</Link>
        </div>
      </section>
    );
  }

  return (
    <section className={styles["faculties-section"]} aria-labelledby="faculties-title">
      <div className={styles["faculties-intro"]}>
        <h2 id="faculties-title">Nuestras Facultades</h2>
        <Link className={styles["faculties-link"]} href="/facultades">Ver facultades</Link>
      </div>
      <div className={styles["faculties-desktop-curtain"]}>
        <div className={styles["faculty-curtain-track"]}>
          {availableFaculties.map((faculty) => (
            <Link className={styles["faculty-curtain-panel"]} href={faculty.href} key={faculty.title}>
              {faculty.imageUrl && <Image src={faculty.imageUrl} alt={faculty.imageAlt} fill sizes="17vw" />}
              <span className={styles["faculty-curtain-shade"]} />
              <span className={styles["faculty-curtain-title"]}>{faculty.title}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles["faculties-mobile-carousel"]}>
        <button className={`${styles["faculty-arrow"]} ${styles["faculty-arrow-previous"]}`} type="button" aria-label="Ver facultades anteriores" onClick={() => move(-1)}>‹</button>
        <div className={styles["faculty-showcase-grid"]} onTouchStart={swipe.onTouchStart} onTouchEnd={swipe.onTouchEnd}>
          {visible.map((faculty, index) => (
            <Link className={styles["faculty-showcase-card"]} href={faculty.href} key={faculty.id ?? index}>
              {faculty.imageUrl && <Image src={faculty.imageUrl} alt={faculty.imageAlt} fill sizes="100vw" />}
              <span className={styles["faculty-showcase-shade"]} />
              <span className={styles["faculty-showcase-title"]}>{faculty.title}</span>
            </Link>
          ))}
          <div className={`${styles["carousel-dots"]} ${styles["faculty-dots"]}`} role="tablist" aria-label="Seleccionar facultad">
            {availableFaculties.map((faculty, index) => (
              <button
                key={faculty.id ?? index}
                type="button"
                className={`${styles["carousel-dot"]} ${index === activeStart ? styles["is-active"] : ""}`}
                aria-label={`Mostrar ${faculty.title}`}
                aria-current={index === activeStart ? "true" : undefined}
                onClick={() => setStart(index)}
              />
            ))}
          </div>
        </div>
        <button className={`${styles["faculty-arrow"]} ${styles["faculty-arrow-next"]}`} type="button" aria-label="Ver facultades siguientes" onClick={() => move(1)}>›</button>
      </div>
    </section>
  );
}
