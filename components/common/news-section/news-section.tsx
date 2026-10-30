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
    "bg-[#f7f6f3] px-4 py-[clamp(2.75rem,4.5vw,4rem)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClassName} id={sectionId} aria-labelledby={titleId}>
      <div className="mx-auto max-w-[var(--content-width)]">
        {/* Encabezado editorial: kicker + título con enlace "ver todas" alineado. */}
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mb-2 flex items-center gap-2 text-[length:var(--fs-2xs)] font-bold uppercase tracking-[.12em] text-[var(--institutional-red)]">
              <span className="h-[2px] w-6 bg-[var(--institutional-gold)]" />
              Actualidad UD
            </span>
            <h2
              className="font-[var(--font-montserrat)] text-[length:var(--fs-h2)] font-bold leading-[.95] text-[#1a1a1a]"
              id={titleId}
            >
              {title}
            </h2>
          </div>
          {showCta && (
            <a
              className="group hidden items-center gap-2 text-[length:var(--fs-xs)] font-bold uppercase tracking-[.04em] text-[var(--institutional-red)] transition-colors hover:text-black sm:inline-flex"
              href={ctaHref}
            >
              {ctaLabel}
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          )}
        </header>
        <NewsCarousel news={news} />
        {showCta && (
          <a
            className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full bg-[var(--institutional-red)] px-8 py-3 text-[length:var(--fs-sm)] font-semibold text-white transition-colors hover:bg-[var(--institutional-gold)] hover:text-black focus-visible:outline-none sm:hidden"
            href={ctaHref}
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
