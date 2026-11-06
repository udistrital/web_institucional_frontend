"use client";

import { useId } from "react";
import Link from "next/link";
import NewsCarousel from "./news-carousel";
import EventsList from "./events-list";
import type { EventItem, NewsItem } from "@/types/domain";

export type { EventItem, NewsItem };

type NewsSectionProps = {
  news: NewsItem[];
  /** Eventos a mostrar en la columna lateral de la sección. */
  events?: EventItem[];
  /** Título de la sección. Por defecto "Noticias y eventos". */
  title?: string;
  /** Texto del enlace del encabezado. Por defecto "Ver noticias y eventos". */
  ctaLabel?: string;
  /** Destino del enlace del encabezado. Por defecto "#noticias". */
  ctaHref?: string;
  /**
   * id del `<section>`, útil como ancla de navegación. Por defecto "noticias".
   * Cámbialo si vas a renderizar varias secciones de noticias en la misma página.
   */
  sectionId?: string;
  /**
   * Oculta los enlaces "Ver todas las noticias" / "Ver todos los eventos"
   * cuando no se necesitan.
   */
  showCta?: boolean;
  /** Clases extra para el `<section>` (por ejemplo para cambiar el fondo). */
  className?: string;
};

export default function NewsSection({
  news,
  events = [],
  title = "Noticias y eventos",
  ctaLabel = "Ver noticias y eventos",
  ctaHref = "/noticias-eventos",
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
        {/* Encabezado editorial: kicker + título con el enlace "ver" alineado. */}
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
            <Link
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
            </Link>
          )}
        </header>
        {/* Noticias y eventos conviven en la misma fila en escritorio; se
            apilan en pantallas pequeñas. Noticias domina el ancho por ser el
            contenido principal y los eventos quedan como columna lateral. */}
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-8">
          <NewsCarousel news={news} />
          <EventsList events={events} />
        </div>
      </div>
    </section>
  );
}
