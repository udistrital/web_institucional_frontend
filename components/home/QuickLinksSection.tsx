"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./home.module.css";
import { useSwipe } from "./useSwipe";

const audiences = [
  { title: "Soy Estudiante", image: "/image/soy estudiante.jpeg", alt: "Estudiante sonriendo mientras usa un computador portátil" },
  { title: "Soy Profesor", image: "/image/soy docente.jpeg", alt: "Profesora trabajando con un computador portátil" },
  { title: "Soy Funcionario", image: "/image/soy funcionario.jpeg", alt: "Funcionaria sonriendo dentro de una sede universitaria" },
  { title: "Soy Egresado", image: "/image/soy egresado.jpeg", alt: "Egresado sonriendo mientras sostiene un diploma" },
];

export default function QuickLinksSection() {
  const [start, setStart] = useState(0);
  const visible = Array.from({ length: 3 }, (_, i) => {
    const index = (start + i) % audiences.length;
    return { ...audiences[index], index };
  });
  const move = (step: number) => setStart((current) => (current + step + audiences.length) % audiences.length);
  const swipe = useSwipe(move);

  return (
    <section className={styles["audience-section"]} id="audiencias" aria-labelledby="audience-title">
      <h2 id="audience-title" className="sr-only">Accesos según tu rol en la universidad</h2>
      <div className={styles["audience-carousel"]}>
        <button type="button" className={styles["carousel-arrow"]} aria-label="Ver accesos anteriores" onClick={() => move(-1)}><span aria-hidden="true">‹</span></button>
        <div className={styles["audience-grid"]} onTouchStart={swipe.onTouchStart} onTouchEnd={swipe.onTouchEnd}>
          {visible.map((audience) => (
            <a className={styles["audience-card"]} href="#" key={audience.index}>
              <Image src={audience.image} alt={audience.alt} fill sizes="(max-width: 720px) 88vw, 28vw" />
              <span className={styles["audience-shade"]} />
              <span className={styles["audience-title"]}>{audience.title}</span>
            </a>
          ))}
        </div>
        <button type="button" className={styles["carousel-arrow"]} aria-label="Ver accesos siguientes" onClick={() => move(1)}><span aria-hidden="true">›</span></button>
      </div>
      <div className={styles["carousel-dots"]} role="tablist" aria-label="Seleccionar acceso">
        {audiences.map((audience, index) => (
          <button
            key={audience.title}
            type="button"
            className={`${styles["carousel-dot"]} ${index === start ? styles["is-active"] : ""}`}
            aria-label={`Mostrar ${audience.title}`}
            aria-current={index === start ? "true" : undefined}
            onClick={() => setStart(index)}
          />
        ))}
      </div>
    </section>
  );
}
