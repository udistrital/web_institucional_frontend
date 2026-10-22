"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { NewsItem } from "./NewsSection";

const ROTATION_INTERVAL = 7000;
const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

type NewsCarouselProps = {
  news: NewsItem[];
};

export default function NewsCarousel({ news }: NewsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
      setActiveIndex((currentIndex) => (currentIndex + 1) % news.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(timer);
  }, [isPaused, news.length, prefersReducedMotion]);

  if (!visibleNews.length) return null;

  const [featuredNews, ...nextNews] = visibleNews;
  const goToNews = (index: number) => {
    setActiveIndex((index + news.length) % news.length);
  };
  const formatDate = (date: string) => dateFormatter.format(new Date(date));

  return (
    <div
      className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
      }}
    >
      <article className="flex flex-col overflow-hidden rounded-b-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,.08)] lg:min-h-[540px]">
        <Image
          className="h-[240px] w-full shrink-0 bg-[#f5f5f5] object-contain transition-transform duration-300 hover:scale-[1.02] lg:h-[270px]"
          src={featuredNews.image}
          alt={featuredNews.alt}
          width={960}
          height={540}
          priority
        />
        <div className="flex min-h-0 flex-1 flex-col p-6 sm:p-8">
          <time className="mb-3 block text-sm text-[#666]" dateTime={featuredNews.publishedAt}>
            {formatDate(featuredNews.publishedAt)}
          </time>
          <h3 className="mb-3 line-clamp-3 font-[var(--font-montserrat)] text-[var(--fs-h3)] font-bold leading-tight text-[var(--institutional-red)]">
            {featuredNews.title}
          </h3>
          <p className="mb-5 line-clamp-4 text-[var(--fs-base)] leading-[var(--lh-snug)] text-[#4d4d4d]">
            {featuredNews.description}
          </p>
          <a
            className="font-semibold text-[var(--institutional-red)] underline-offset-4 hover:text-black hover:underline"
            href={featuredNews.href || "#noticias"}
          >
            Ver más
          </a>
        </div>
      </article>

      <aside
        className="hidden flex-col rounded-2xl bg-[var(--institutional-red)] p-6 text-white sm:p-8 lg:flex lg:min-h-[540px]"
        aria-label="Noticias siguientes"
      >
        <h3 className="mb-5 font-[var(--font-montserrat)] text-[var(--fs-xl)] font-bold leading-tight">
          También te puede interesar
        </h3>
        <motion.ol
          key={activeIndex}
          className="m-0 list-none divide-y divide-white/30 p-0"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {nextNews.map((item) => (
            <li key={item.id} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                className="group flex w-full items-center gap-4 text-left text-base font-semibold leading-snug hover:text-[var(--institutional-gold)]"
                onClick={() => {
                  const selectedIndex = news.findIndex((newsItem) => newsItem.id === item.id);
                  if (selectedIndex >= 0) setActiveIndex(selectedIndex);
                }}
              >
                <span className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
                  <Image
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                    src={item.image}
                    alt=""
                    fill
                    sizes="96px"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block line-clamp-2">{item.title}</span>
                  <time className="mt-1 block text-xs font-normal text-white/75" dateTime={item.publishedAt}>
                    {formatDate(item.publishedAt)}
                  </time>
                </span>
              </button>
            </li>
          ))}
        </motion.ol>
        {news.length > 4 && (
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/30 pt-4">
            <button
              type="button"
              className="rounded-full border border-white/70 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white hover:text-[var(--institutional-red)]"
              onClick={() => goToNews(activeIndex - 1)}
              aria-label="Ver noticia anterior"
            >
              ← Anteriores
            </button>
            <span className="text-xs text-white/75" aria-live="polite">
              {activeIndex + 1} de {news.length}
            </span>
            <button
              type="button"
              className="rounded-full border border-white/70 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white hover:text-[var(--institutional-red)]"
              onClick={() => goToNews(activeIndex + 1)}
              aria-label="Ver noticia siguiente"
            >
              Siguientes →
            </button>
          </div>
        )}
        {news.length > 1 && (
          <p className="mt-6 text-sm text-white/80" aria-live="polite">
            {isPaused || prefersReducedMotion
              ? "Rotación pausada"
              : "La selección cambia cada 7 segundos"}
          </p>
        )}
      </aside>
    </div>
  );
}
