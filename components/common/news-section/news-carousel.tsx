"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { NewsItem } from "@/types/domain";
import { rutaContenido } from "@/app/noticias-eventos/lib/contenido";
import { formatearFechaLarga } from "@/lib/fechas";

const ROTATION_INTERVAL = 7000;
const ROTATION_SECONDS = ROTATION_INTERVAL / 1000;

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
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
);

type NewsCarouselProps = {
  news: NewsItem[];
};

export default function NewsCarousel({ news }: NewsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  // En móvil solo se muestra la noticia destacada (el aside "Más noticias"
  // está oculto), así que la rotación automática se desactiva para que la
  // tarjeta no cambie sola sin que el usuario pueda controlarla.
  const [isMobile, setIsMobile] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(ROTATION_SECONDS);

  const selectIndex = (nextIndex: number) => {
    setActiveIndex(nextIndex);
    setSecondsLeft(ROTATION_SECONDS);
  };

  // Ordena las noticias empezando por la activa: la primera es la destacada y
  // el resto alimenta la lista "Más noticias" (que tiene scroll propio).
  const orderedNews = useMemo(() => {
    if (!news.length) return [];

    return Array.from({ length: news.length }, (_, offset) => {
      return news[(activeIndex + offset) % news.length];
    });
  }, [activeIndex, news]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    // Por debajo de lg (1024px) no se muestra la lista lateral: solo la
    // noticia destacada. En ese rango se considera "móvil" y se corta la
    // rotación automática.
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || isMobile || news.length < 2) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setActiveIndex((currentIndex) => (currentIndex + 1) % news.length);
          return ROTATION_SECONDS;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isPaused, news.length, prefersReducedMotion, isMobile]);

  if (!orderedNews.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/60 px-6 py-16 text-center">
        <p className="text-[length:var(--fs-base)] font-semibold text-[#555]">
          No hay noticias disponibles por el momento.
        </p>
        <p className="mt-1 text-[length:var(--fs-sm)] text-[#8a8a8a]">
          Vuelve pronto para conocer las novedades de la Universidad.
        </p>
      </div>
    );
  }

  const [featuredNews, ...nextNews] = orderedNews;
  const formatDate = (date: string) => formatearFechaLarga(date);
  const progress = ((ROTATION_SECONDS - secondsLeft) / ROTATION_SECONDS) * 100;

  return (
    <div
      className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(19rem,1fr)] xl:grid-cols-1 2xl:grid-cols-[minmax(0,1.5fr)_minmax(19rem,1fr)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      {/* ---- Noticia destacada: toda la tarjeta es un enlace ----
          No se remonta al cambiar de noticia (sin `key` por id) y solo se
          anima la opacidad: así el layout no se desplaza y la página no salta
          al rotar. El fade por cambio lo controla la `key` interna del bloque
          de contenido, que no altera la altura de la tarjeta. */}
      <motion.article
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Link
          className="group flex h-full flex-col overflow-hidden border border-black/5 bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,.18)] transition-shadow duration-300 hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--institutional-red)] focus-visible:ring-offset-2 lg:h-[560px] xl:h-[560px] 2xl:h-[560px]"
          href={rutaContenido({ kind: "noticia", title: featuredNews.title })}
        >
          <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#ededed] lg:h-[300px]">
            <Image
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              src={featuredNews.image}
              alt={featuredNews.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
            />
          </div>
          <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-8">
            <time
              className="mb-3 block text-[length:var(--fs-2xs)] font-semibold uppercase tracking-[.06em] text-[#8a8a8a]"
              dateTime={featuredNews.publishedAt}
            >
              {formatDate(featuredNews.publishedAt)}
            </time>
            <h3 className="mb-3 font-[var(--font-montserrat)] text-[var(--fs-h3)] font-bold leading-tight text-[#1a1a1a] transition-colors group-hover:text-[var(--institutional-red)]">
              {featuredNews.title}
            </h3>
            {/* El resumen ocupa el espacio restante y se trunca con "..."
                cuando se desborda (line-clamp añade la elipsis). */}
            <p className="mb-6 line-clamp-3 min-h-0 flex-1 text-[var(--fs-base)] leading-[var(--lh-normal)] text-[#555] sm:line-clamp-4 lg:line-clamp-5">
              {featuredNews.description}
            </p>
            <span className="mt-auto inline-flex w-fit items-center gap-2 text-[length:var(--fs-2xs)] font-bold uppercase tracking-[.04em] text-[var(--institutional-red)] transition-colors group-hover:text-black">
              Leer noticia
              <ArrowIcon className="h-[.9rem] w-[.9rem] transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </Link>
      </motion.article>

      {/* ---- Lista de siguientes noticias ---- */}
      <aside
        className="hidden flex-col border border-black/5 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,.18)] sm:p-6 lg:flex lg:h-[560px] xl:hidden 2xl:flex 2xl:h-[560px]"
        aria-label="Más noticias"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="h-5 w-1 rounded-full bg-[var(--institutional-red)]" />
          <h3 className="font-[var(--font-montserrat)] text-[var(--fs-lg)] font-bold leading-tight text-[#1a1a1a]">
            Más noticias
          </h3>
        </div>
        {nextNews.length ? (
          // Lista con scroll propio: evita que las noticias se corten y permite
          // recorrerlas todas sin importar cuántas haya.
          <motion.ol
            className="-mr-2 m-0 min-h-0 flex-1 list-none space-y-3 overflow-y-auto overscroll-contain pr-2 [scrollbar-color:var(--institutional-gold)_transparent] [scrollbar-width:thin]"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {nextNews.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="group flex w-full cursor-pointer flex-col overflow-hidden border border-black/5 bg-white text-left transition-colors hover:border-[var(--institutional-red)]/30 hover:bg-[#faf7f0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--institutional-red)]"
                  onClick={() => {
                    const selectedIndex = news.findIndex((newsItem) => newsItem.id === item.id);
                    if (selectedIndex >= 0) {
                      selectIndex(selectedIndex);
                    }
                  }}
                >
                  <span className="relative block h-28 w-full shrink-0 overflow-hidden bg-[#ededed]">
                    <Image
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 50vw, 300px"
                    />
                  </span>
                  {/* Fecha debajo de la imagen, seguida del título. */}
                  <span className="flex min-w-0 flex-col p-3">
                    <time
                      className="mb-1 block text-[length:var(--fs-2xs)] font-semibold uppercase tracking-[.05em] text-[#9a9a9a]"
                      dateTime={item.publishedAt}
                    >
                      {formatDate(item.publishedAt)}
                    </time>
                    <span className="block line-clamp-2 text-[length:var(--fs-sm)] font-semibold leading-snug text-[#2a2a2a] transition-colors group-hover:text-[var(--institutional-red)]">
                      {item.title}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </motion.ol>
        ) : (
          // Solo hay una noticia: no quedan más para listar.
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center border border-dashed border-black/15 bg-white/60 px-6 py-10 text-center">
            <p className="text-[length:var(--fs-sm)] font-semibold text-[#555]">
              No hay más noticias disponibles.
            </p>
          </div>
        )}

        {/* Barra de progreso de la rotación automática. */}
        {news.length > 1 && (
          <div className="mt-4 shrink-0 border-t border-black/10 pt-4">
            <div
              className="mb-2 h-1 w-full overflow-hidden rounded-full bg-black/10"
              role="progressbar"
              aria-label="Tiempo para la siguiente noticia"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={isPaused || prefersReducedMotion ? 0 : Math.round(progress)}
            >
              <div
                className="h-full rounded-full bg-[var(--institutional-gold)] transition-[width] duration-1000 ease-linear"
                style={{ width: `${isPaused || prefersReducedMotion ? 0 : progress}%` }}
              />
            </div>
            <span className="text-[length:var(--fs-2xs)] font-medium text-[#9a9a9a]" aria-live="polite">
              {isPaused || prefersReducedMotion
                ? "Rotación pausada"
                : `Siguiente noticia en ${secondsLeft}s`}
            </span>
          </div>
        )}
      </aside>
    </div>
  );
}
