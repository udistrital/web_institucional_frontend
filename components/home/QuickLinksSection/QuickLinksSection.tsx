"use client";

import { useState } from "react";

import Tarjet from "@/components/tarjet/tarjet";
import { mainNavigation } from "@/navegation/audience_services";

import styles from "../home.module.css";
import { useSwipe } from "../useSwipe";
import type { QuickLinksSectionProps } from "./QuickLinksSection.types";

const profiles = mainNavigation.slice(0, 6);

export default function QuickLinksSection({ className }: QuickLinksSectionProps) {
  const [start, setStart] = useState(0);
  const total = profiles.length;

  const visible = Array.from({ length: 3 }, (_, i) => {
    const index = (start + i) % total;
    return profiles[index];
  });

  const move = (step: number) =>
    setStart((current) => (current + step + total) % total);

  const swipe = useSwipe(move);

  const sectionClassName = className
    ? `${styles["audience-section"]} ${className}`
    : styles["audience-section"];

  return (
    <section
      className={sectionClassName}
      id="audiencias"
      aria-labelledby="audience-title"
    >
      <h2 id="audience-title" className="sr-only">
        Accesos según tu rol en la universidad
      </h2>
      <div className={styles["audience-carousel"]}>
        <button
          type="button"
          className={styles["carousel-arrow"]}
          aria-label="Ver accesos anteriores"
          onClick={() => move(-1)}
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div
          className={styles["audience-grid"]}
          onTouchStart={swipe.onTouchStart}
          onTouchEnd={swipe.onTouchEnd}
        >
          {visible.map((profile) => (
            <Tarjet
              key={profile.href}
              service={profile}
              variant="carousel"
            />
          ))}
        </div>
        <button
          type="button"
          className={styles["carousel-arrow"]}
          aria-label="Ver accesos siguientes"
          onClick={() => move(1)}
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
      <div
        className={styles["carousel-dots"]}
        role="tablist"
        aria-label="Seleccionar acceso"
      >
        {profiles.map((profile, index) => (
          <button
            key={profile.label}
            type="button"
            className={`${styles["carousel-dot"]} ${index === start ? styles["is-active"] : ""}`}
            aria-label={`Mostrar ${profile.label}`}
            aria-current={index === start ? "true" : undefined}
            onClick={() => setStart(index)}
          />
        ))}
      </div>
    </section>
  );
}
