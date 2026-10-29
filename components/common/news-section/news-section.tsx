"use client";

import { useId } from "react";
import NewsCarousel from "./news-carousel";
import type { NewsItem } from "@/types/domain";

export type { NewsItem };

type NewsSectionProps = {
  news: NewsItem[];
  /** Título de la sección. Por defecto "Noticias". */
  title?: string;
  /** Texto del enlace inferior. Por defecto "Ver todas las noticias". */
  ctaLabel?: string;
  /** Destino del enlace inferior. Por defecto "#noticias". */
  ctaHref?: string;
  /**
   * id del `<section>`, útil como ancla de navegación. Por defecto "noticias".
   * Cámbialo si vas a renderizar varias secciones de noticias en la misma página.
   */
  sectionId?: string;
  /**
   * Oculta el enlace inferior "Ver todas las noticias" cuando no se necesita.
   */
  showCta?: boolean;
  /** Clases extra para el `<section>` (por ejemplo para cambiar el fondo). */
  className?: string;
};

export default function NewsSection({
  news,
  title = "Noticias",
  ctaLabel = "Ver todas las noticias",
  ctaHref = "#noticias",
  sectionId = "noticias",
  showCta = true,
  className = "",
}: NewsSectionProps) {
  // Identificador único para enlazar el título con la sección (accesibilidad)
  // sin colisionar cuando hay varias instancias en la misma página.
  const titleId = useId();

  const sectionClassName = [
    "bg-[#f5f5f5] px-4 py-[clamp(2rem,3.5vw,2.75rem)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClassName} id={sectionId} aria-labelledby={titleId}>
      <div className="mx-auto max-w-[var(--content-width)]">
        <h2
          className="mb-8 font-[var(--font-montserrat)] text-[length:var(--fs-h2)] font-bold leading-[.9] text-[var(--institutional-red)]"
          id={titleId}
        >
          {title}
        </h2>
        <NewsCarousel news={news} />
        {showCta && (
          <a
            className="mx-auto mt-10 block w-fit rounded-[5px] bg-[var(--institutional-red)] px-11 py-3 font-semibold text-white transition-colors hover:bg-[var(--institutional-gold)] hover:text-black focus-visible:outline-none"
            href={ctaHref}
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
