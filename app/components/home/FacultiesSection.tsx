"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./home.module.css";
import { useSwipe } from "./useSwipe";
import type { Faculty } from "@/types/domain";

export default function FacultiesSection({ faculties }: { faculties: Faculty[] }) {
  const [start, setStart] = useState(0);
  const move = (step: number) =>
    setStart((current) =>
      faculties.length ? (current + step + faculties.length) % faculties.length : 0,
    );
  const visible = faculties.length
    ? Array.from({ length: 3 }, (_, index) => faculties[(start + index) % faculties.length]).filter(
        (faculty): faculty is Faculty => Boolean(faculty),
      )
    : [];
  const swipe = useSwipe(move);

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
          {faculties.map((faculty, index) => (
            <Link className={styles["faculty-curtain-panel"]} href={faculty.href} key={faculty.id ?? index}>
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
            {faculties.map((faculty, index) => (
              <button
                key={faculty.id ?? index}
                type="button"
                className={`${styles["carousel-dot"]} ${index === start ? styles["is-active"] : ""}`}
                aria-label={`Mostrar ${faculty.title}`}
                aria-current={index === start ? "true" : undefined}
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
