"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./home.module.css";
import { useSwipe } from "./useSwipe";

const slides = [
  {
    title: "Universidad Distrital le da la bienvenida a los nuevos estudiantes y sus familias",
    description: "Bienestar Universitario, anunció la fecha establecida para la realización del evento de bienvenida",
    image: "/image/hero.jpeg",
    alt: "Estudiante de la Universidad Distrital usando casco de seguridad",
  },
  {
    title: "Construimos universidad con compromiso social",
    description: "Conoce las noticias y actividades que conectan a nuestra comunidad universitaria.",
    image: "/image/compromiso social.jpeg",
    alt: "Comunidad universitaria reunida en una actividad institucional",
  },
];

export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const currentSlide = slides[activeSlide];
  const swipe = useSwipe((direction) => setActiveSlide((current) => (current + direction + slides.length) % slides.length));

  return (
    <section className={styles.hero} aria-label="Noticias destacadas" onTouchStart={swipe.onTouchStart} onTouchEnd={swipe.onTouchEnd}>
      <div className={styles["hero-media"]}>
        {slides.map((slide, index) => (
          <Image key={slide.image} src={slide.image} alt={slide.alt} fill priority={index === 0} sizes="100vw" className={`${styles["hero-image"]} ${index === activeSlide ? styles["is-active"] : ""}`} />
        ))}
      </div>
      <div className={styles["hero-overlay"]} />
      <a className={styles["hero-mobile-link"]} href="#audiencias" aria-label="Explorar accesos por rol"></a>
      <div className={styles["hero-content"]}>
        {/* <p className={styles["hero-kicker"]}>Universidad Distrital</p> */}
        <h1>{currentSlide.title}</h1>
        <p className={styles["hero-description"]}>{currentSlide.description}</p>
        <a className={styles["hero-link"]} href="#audiencias">Explorar accesos por rol</a>
      </div>
      <div className={styles["hero-controls"]} aria-label="Seleccionar noticia destacada">
        {slides.map((slide, index) => (
          <button key={slide.title} type="button" className={`${styles["hero-dot"]} ${index === activeSlide ? styles["is-active"] : ""}`} aria-label={`Mostrar noticia ${index + 1}`} aria-current={index === activeSlide ? "true" : undefined} onClick={() => setActiveSlide(index)} />
        ))}
      </div>
    </section>
  );
}
