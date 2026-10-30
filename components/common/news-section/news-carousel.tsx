"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { NewsItem } from "@/types/domain";

const ROTATION_INTERVAL = 7000;
const ROTATION_SECONDS = ROTATION_INTERVAL / 1000;
const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

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
  const [secondsLeft, setSecondsLeft] = useState(ROTATION_SECONDS);

  const visibleNews = useMemo(() => {
    if (!news.length) return [];

    return Array.from({ length: Math.min(4, news.length) }, (_, offset) => {
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
    if (isPaused || prefersReducedMotion || news.length < 2) return;

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
  }, [isPaused, news.length, prefersReducedMotion]);

  if (!visibleNews.length) return null;

  const [featuredNews, ...nextNews] = visibleNews;
  // Al navegar manualmente se reinicia la cuenta regresiva a su valor completo.
  const goToNews = (index: number) => {
    setActiveIndex((index + news.length) % news.length);
    setSecondsLeft(ROTATION_SECONDS);
  };
  const formatDate = (date: string) => dateFormatter.format(new Date(date));
  const progress = ((ROTATION_SECONDS - secondsLeft) / ROTATION_SECONDS) * 100;

  return (
    <div
      className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(21rem,1fr)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      {/* ---- Noticia destacada ---- */}
      <motion.article
        key={featuredNews.id}
        className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,.18)] lg:h-[560px]"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
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
          {/* Etiqueta "Destacada" como acento editorial. */}
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[var(--institutional-red)] px-3 py-1 text-[length:var(--fs-2xs)] font-bold uppercase tracking-[.08em] text-white shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--institutional-gold)]" />
            Destacada
          </span>
        </div>
        <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-8">
          <time
            className="mb-3 block text-[length:var(--fs-2xs)] font-semibold uppercase tracking-[.06em] text-[#8a8a8a]"
            dateTime={featuredNews.publishedAt}
          >
            {formatDate(featuredNews.publishedAt)}
          </time>
          <h3 className="mb-3 line-clamp-3 font-[var(--font-montserrat)] text-[var(--fs-h3)] font-bold leading-tight text-[#1a1a1a] transition-colors group-hover:text-[var(--institutional-red)]">
            {featuredNews.title}
          </h3>
          <p className="mb-6 line-clamp-4 text-[var(--fs-base)] leading-[var(--lh-normal)] text-[#555]">
            {featuredNews.description}
          </p>
          <a
            className="group/link mt-auto inline-flex w-fit items-center gap-2 text-[length:var(--fs-2xs)] font-bold uppercase tracking-[.04em] text-[var(--institutional-red)] transition-colors hover:text-black"
            href={featuredNews.href || "#noticias"}
          >
            Leer noticia
            <ArrowIcon className="h-[.9rem] w-[.9rem] transition-transform duration-300 group-hover/link:translate-x-1" />
          </a>
        </div>
      </motion.article>

      {/* ---- Lista de siguientes noticias ---- */}
      <aside
        className="hidden flex-col rounded-2xl border border-black/5 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,.18)] sm:p-6 lg:flex lg:h-[560px]"
        aria-label="Más noticias"
      >
        <div className="mb-4 flex items-center gap-3">
          <span className="h-5 w-1 rounded-full bg-[var(--institutional-red)]" />
          <h3 className="font-[var(--font-montserrat)] text-[var(--fs-lg)] font-bold leading-tight text-[#1a1a1a]">
            Más noticias
          </h3>
        </div>
        <motion.ol
          key={activeIndex}
          className="m-0 min-h-0 flex-1 list-none space-y-2 overflow-hidden p-0"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {nextNews.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="group flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent p-2 text-left transition-colors hover:border-black/5 hover:bg-[#faf7f0] focus-visible:outline-none"
                onClick={() => {
                  const selectedIndex = news.findIndex((newsItem) => newsItem.id === item.id);
                  if (selectedIndex >= 0) {
                    setActiveIndex(selectedIndex);
                    setSecondsLeft(ROTATION_SECONDS);
                  }
                }}
              >
                <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-[#ededed]">
                  <Image
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                    src={item.image}
                    alt=""
                    fill
                    sizes="96px"
                  />
                </span>
                <span className="min-w-0">
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

        <div className="mt-4 shrink-0 border-t border-black/10 pt-4">
          {/* Barra de progreso de la rotación automática. */}
          {news.length > 1 && (
            <div
              className="mb-4 h-1 w-full overflow-hidden rounded-full bg-black/10"
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
          )}
          <div className="flex items-center justify-between gap-3">
            {news.length > 4 ? (
              <>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/15 text-[#555] transition-colors hover:border-[var(--institutional-red)] hover:bg-[var(--institutional-red)] hover:text-white focus-visible:outline-none"
                  onClick={() => goToNews(activeIndex - 1)}
                  aria-label="Ver noticia anterior"
                >
                  <ArrowIcon className="h-4 w-4 rotate-180" />
                </button>
                <span className="text-[length:var(--fs-2xs)] font-semibold tabular-nums text-[#8a8a8a]" aria-live="polite">
                  {activeIndex + 1} / {news.length}
                </span>
                <button
                  type="button"
                  className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/15 text-[#555] transition-colors hover:border-[var(--institutional-red)] hover:bg-[var(--institutional-red)] hover:text-white focus-visible:outline-none"
                  onClick={() => goToNews(activeIndex + 1)}
                  aria-label="Ver noticia siguiente"
                >
                  <ArrowIcon className="h-4 w-4" />
                </button>
              </>
            ) : (
              news.length > 1 && (
                <span className="text-[length:var(--fs-2xs)] font-medium text-[#9a9a9a]" aria-live="polite">
                  {isPaused || prefersReducedMotion
                    ? "Rotación pausada"
                    : `Cambia en ${secondsLeft}s`}
                </span>
              )
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
