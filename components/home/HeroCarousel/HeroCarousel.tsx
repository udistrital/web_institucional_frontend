"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { HeroSlide } from "@/services/hero";

import styles from "../home.module.css";
import { useSwipe } from "../useSwipe";
import type { HeroCarouselProps } from "./HeroCarousel.types";

const AUTOPLAY_INTERVAL_MS = 7000;

function SlideMedia({ slide, priority }: { slide: HeroSlide; priority: boolean }) {
  return (
    <Image
      src={slide.image}
      alt={slide.alt}
      fill
      priority={priority}
      sizes="100vw"
      className={styles["hero-image"]}
    />
  );
}

export default function HeroCarousel({ slides, className }: HeroCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, slides.length]);

  const swipe = useSwipe((direction) =>
    setActiveSlide((current) => (current + direction + slides.length) % slides.length),
  );

  if (!slides.length) return null;

  const sectionClassName = className
    ? `${styles.hero} ${className}`
    : styles.hero;

  return (
    <section
      className={sectionClassName}
      aria-label="Banner principal"
      onTouchStart={swipe.onTouchStart}
      onTouchEnd={swipe.onTouchEnd}
    >
      <div className={styles["hero-media"]}>
        {slides.map((slide, index) => {
          const isActive = index === activeSlide;
          const slideClassName = `${styles["hero-slide"]} ${isActive ? styles["is-active"] : ""}`;
          const media = <SlideMedia slide={slide} priority={index === 0} />;

          // Cada banner usa su propio enlace (field_enlace). Solo el slide activo
          // es interactivo; si no tiene enlace, se muestra sin redirección.
          return slide.linkUrl ? (
            <a
              key={slide.id}
              className={slideClassName}
              href={slide.linkUrl}
              aria-label={slide.linkTitle || slide.alt || "Ir al enlace del banner"}
              tabIndex={isActive ? 0 : -1}
              aria-hidden={isActive ? undefined : true}
            >
              {media}
            </a>
          ) : (
            <div key={slide.id} className={slideClassName} aria-hidden={isActive ? undefined : true}>
              {media}
            </div>
          );
        })}
      </div>

      {hasMultipleSlides && (
        <div className={styles["hero-controls"]} aria-label="Seleccionar banner">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`${styles["hero-dot"]} ${index === activeSlide ? styles["is-active"] : ""}`}
              aria-label={`Mostrar banner ${index + 1}`}
              aria-current={index === activeSlide ? "true" : undefined}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
