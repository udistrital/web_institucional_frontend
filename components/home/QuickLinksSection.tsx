"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./home.module.css";

const audiences = [
  { title: "Soy Estudiante", image: "/image/soy estudiante.jpeg", alt: "Estudiante sonriendo mientras usa un computador portátil" },
  { title: "Soy Profesor", image: "/image/soy docente.jpeg", alt: "Profesora trabajando con un computador portátil" },
  { title: "Soy Funcionario", image: "/image/soy funcionario.jpeg", alt: "Funcionaria sonriendo dentro de una sede universitaria" },
  { title: "Vida Universitaria", image: "/image/vida universitaria.jpeg", alt: "Actividad de la vida universitaria" },
  { title: "Inscripciones", image: "/image/inscripciones.png", alt: "Información sobre inscripciones universitarias" },
  { title: "Facultades", image: "/image/facultad ingenieria.jpg", alt: "Edificio de una facultad de la Universidad Distrital" },
];

export default function QuickLinksSection() {
  const [start, setStart] = useState(0);
  const visible = audiences.slice(start, start + 3);
  const move = (step: number) => setStart((current) => (current + step + audiences.length) % audiences.length);

  return (
    <section className={styles["audience-section"]} id="audiencias" aria-labelledby="audience-title">
      <h2 id="audience-title" className="sr-only">Accesos según tu rol en la universidad</h2>
      <div className={styles["audience-carousel"]}>
        <button type="button" className={styles["carousel-arrow"]} aria-label="Ver accesos anteriores" onClick={() => move(-1)}><span aria-hidden="true">‹</span></button>
        <div className={styles["audience-grid"]}>
          {visible.map((audience) => (
            <a className={styles["audience-card"]} href="#" key={audience.title}>
              <Image src={audience.image} alt={audience.alt} fill sizes="(max-width: 720px) 88vw, 28vw" />
              <span className={styles["audience-shade"]} />
              <span className={styles["audience-title"]}>{audience.title}</span>
            </a>
          ))}
        </div>
        <button type="button" className={styles["carousel-arrow"]} aria-label="Ver accesos siguientes" onClick={() => move(1)}><span aria-hidden="true">›</span></button>
      </div>
    </section>
  );
}
