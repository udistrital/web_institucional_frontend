"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./home.module.css";
import { useSwipe } from "./useSwipe";

const faculties = [
  { title: "Facultad de Ingeniería", href: "/facultades/ingenieria", image: "/image/facultad ingenieria.jpg", alt: "Edificio de la Facultad de Ingeniería" },
  { title: "Facultad ASAB", href: "/facultades/artes-asab", image: "/image/facultad de artes.jpeg", alt: "Edificio de la Facultad de Artes ASAB" },
  { title: "Facultad de Tecnológica", href: "/facultades/tecnologica", image: "/image/facultad tecnologica.jpeg", alt: "Edificio de la Facultad Tecnológica" },
  { title: "Facultad de Ciencias y Educación", href: "/facultades/ciencias-educacion", image: "/image/facultad ciencias y educacion.jpeg", alt: "Edificio de la Facultad de Ciencias y Educación" },
  { title: "Facultad de Ciencias de la Salud", href: "/facultades/ciencias-salud", image: "/image/facultad de ciencias de la salud.jpeg", alt: "Facultad de Ciencias de la Salud" },
  { title: "Facultad del Medio Ambiente", href: "/facultades/medio-ambiente-recursos-naturales", image: "/image/facultad de medio ambiente.jpeg", alt: "Facultad del Medio Ambiente y Recursos Naturales" },
  { title: "Facultad de Ciencias Matemáticas y Naturales", href: "/facultades/ciencias-matematicas-naturales", image: "/image/facultad de matematicas y ciencias.jpeg", alt: "Facultad de Ciencias Matemáticas y Naturales" },
];

export default function FacultiesSection() {
  const [start, setStart] = useState(0);
  const move = (step: number) => setStart((current) => (current + step + faculties.length) % faculties.length);
  const visible = Array.from({ length: 3 }, (_, index) => faculties[(start + index) % faculties.length]);
  const swipe = useSwipe(move);

  return (
    <section className={styles["faculties-section"]} aria-labelledby="faculties-title">
      <div className={styles["faculties-intro"]}>
        <h2 id="faculties-title">Nuestras Facultades</h2>
        <Link className={styles["faculties-link"]} href="/facultades">Ver facultades</Link>
      </div>
      <div className={styles["faculties-desktop-curtain"]}>
        <div className={styles["faculty-curtain-track"]}>
          {faculties.map((faculty) => (
            <Link className={styles["faculty-curtain-panel"]} href={faculty.href} key={faculty.title}>
              <Image src={faculty.image} alt={faculty.alt} fill sizes="17vw" />
              <span className={styles["faculty-curtain-shade"]} />
              <span className={styles["faculty-curtain-title"]}>{faculty.title}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className={styles["faculties-mobile-carousel"]}>
        <button className={`${styles["faculty-arrow"]} ${styles["faculty-arrow-previous"]}`} type="button" aria-label="Ver facultades anteriores" onClick={() => move(-1)}>‹</button>
        <div className={styles["faculty-showcase-grid"]} onTouchStart={swipe.onTouchStart} onTouchEnd={swipe.onTouchEnd}>
          {visible.map((faculty) => (
            <Link className={styles["faculty-showcase-card"]} href={faculty.href} key={faculty.title}>
              <Image src={faculty.image} alt={faculty.alt} fill sizes="100vw" />
              <span className={styles["faculty-showcase-shade"]} />
              <span className={styles["faculty-showcase-title"]}>{faculty.title}</span>
            </Link>
          ))}
          <div className={`${styles["carousel-dots"]} ${styles["faculty-dots"]}`} role="tablist" aria-label="Seleccionar facultad">
            {faculties.map((faculty, index) => (
              <button
                key={faculty.title}
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
