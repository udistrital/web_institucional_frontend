"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { FocusEvent } from "react";
import type { HeroSlide } from "@/types/domain";
import { useSwipe } from "@/app/components/home/useSwipe";
import styles from "./faculty-banner-carousel.module.css";

const AUTOPLAY_INTERVAL_MS = 7000;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const IMAGE_SIZES = "(max-width: 1023px) 100vw, 50vw";

type FacultyBannerCarouselProps = {
  slides: HeroSlide[];
};

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** En el servidor se asume movimiento reducido: no hay autoplay hasta hidratar. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => true,
  );
}

function SlideMedia({ slide, isFirst }: { slide: HeroSlide; isFirst: boolean }) {
  return (
    <>
      <Image
        alt={slide.alt}
        className={`${styles.image} ${styles.imageDesktop}`}
        fetchPriority={isFirst ? "high" : undefined}
        fill
        sizes={IMAGE_SIZES}
        src={slide.image}
      />
      <Image
        alt={slide.alt}
        className={`${styles.image} ${styles.imageMobile}`}
        fetchPriority={isFirst ? "high" : undefined}
        fill
        sizes={IMAGE_SIZES}
        src={slide.mobileImage}
      />
    </>
  );
}

/** Carrusel de banners para la mitad derecha del hero de una facultad. */
export default function FacultyBannerCarousel({ slides }: FacultyBannerCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasMultipleSlides = slides.length > 1;
  const isAutoplaying =
    hasMultipleSlides && !isHovered && !hasFocus && !prefersReducedMotion;

  // Un temporizador por slide: elegir un banner a mano reinicia la cuenta.
  useEffect(() => {
    if (!isAutoplaying) return;

    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => window.clearTimeout(timer);
  }, [activeSlide, isAutoplaying, slides.length]);

  const swipe = useSwipe((direction) =>
    setActiveSlide((current) => (current + direction + slides.length) % slides.length),
  );

  if (!slides.length) return null;

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setHasFocus(false);
    }
  };

  return (
    <section
      aria-label="Banners de la facultad"
      className={styles.carousel}
      onBlur={handleBlur}
      onFocus={() => setHasFocus(true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchEnd={hasMultipleSlides ? swipe.onTouchEnd : undefined}
      onTouchStart={hasMultipleSlides ? swipe.onTouchStart : undefined}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeSlide;
        const className = `${styles.slide} ${isActive ? styles.isActive : ""}`;
        const media = <SlideMedia isFirst={index === 0} slide={slide} />;

        return slide.linkUrl ? (
          <a
            aria-hidden={isActive ? undefined : true}
            aria-label={slide.linkTitle || slide.title || slide.alt}
            className={className}
            href={slide.linkUrl}
            key={slide.id}
            tabIndex={isActive ? 0 : -1}
          >
            {media}
          </a>
        ) : (
          <div aria-hidden={isActive ? undefined : true} className={className} key={slide.id}>
            {media}
          </div>
        );
      })}

      {hasMultipleSlides ? (
        <div aria-label="Seleccionar banner" className={styles.controls} role="group">
          {slides.map((slide, index) => (
            <button
              aria-current={index === activeSlide ? "true" : undefined}
              aria-label={`Mostrar banner ${index + 1}`}
              className={`${styles.dot} ${index === activeSlide ? styles.isActive : ""}`}
              key={slide.id}
              onClick={() => setActiveSlide(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
