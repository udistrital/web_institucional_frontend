"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { mobilePanelVariants } from "../dropdown-motion";
import Buscador from "./buscador";
import Campus from "./campus";
import OfertaAcademica from "./oferta-academica";
import NuestraUniversidad from "./nuestra-universidad";
import SearchResults, { type SearchResult } from "./search-results";
import Aspirantes from "./aspirantes";
import Internacionalizacion from "./internacionalizacion";
import {
  type NavigationItem,
  campusNavigation,
  nuestraUniversidadNavigation,
  ofertaAcademicaNavigation,
} from "./navigation";
import styles from "./mani-menu.module.css";

// Todos los menús para búsqueda
const allNavigationItems: NavigationItem[] = [
  nuestraUniversidadNavigation,
  campusNavigation,
  ofertaAcademicaNavigation,
];

// Items del menú mobile (capa 1)
const mobileMenuItems: NavigationItem[] = [
  nuestraUniversidadNavigation,
  ofertaAcademicaNavigation,
  { label: "Internacionalización", href: "/internacionalizacion" },
  { label: "Estudia en la UD", href: "/aspirantes" },
  campusNavigation,
];

function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function characterMatchScore(source: string, token: string): number {
  if (!source || !token) return 0;
  return source.includes(token) ? 1 : 0;
}

function searchNavigation(
  items: NavigationItem[],
  query: string,
  parents: string[] = [],
): SearchResult[] {
  const tokens = normalizeSearchText(query).trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return items
    .reduce<SearchResult[]>((results, item) => {
      const label = normalizeSearchText(item.label);
      const context = normalizeSearchText([...parents, item.label].join(" "));

      const scores = tokens.map((token) =>
        Math.max(
          characterMatchScore(label, token) * 2,
          characterMatchScore(context, token),
        ),
      );

      if (scores.every((score) => score > 0)) {
        results.push({
          item,
          parents,
          score: scores.reduce((total, score) => total + score, 0),
        });
      }

      if (item.children && item.children.length > 0) {
        results.push(
          ...searchNavigation(item.children, query, [...parents, item.label]),
        );
      }

      return results;
    }, [])
    .sort((first, second) => second.score - first.score);
}

export default function MainMenuPruv() {
  const [openMenu, setOpenMenu] = useState<
    "universidad" | "campus" | "oferta" | "vida" | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Mobile state
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileStack, setMobileStack] = useState<NavigationItem[]>([]);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const closeMenu = () => setOpenMenu(null);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setMobileStack([]);
  }, []);

  useEffect(() => {
    const closeMenusOnScroll = () => setOpenMenu(null);
    window.addEventListener("scroll", closeMenusOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", closeMenusOnScroll);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchNavigation(allNavigationItems, searchQuery);
  }, [searchQuery]);

  // Items visibles en la capa actual del menú mobile
  const currentMobileItems =
    mobileStack.length === 0
      ? mobileMenuItems
      : mobileStack[mobileStack.length - 1].children ?? [];

  return (
    <div className="contents">
      {/* ── Buscador DESKTOP (original) ── */}
      <div className="relative col-start-2 row-start-2 hidden self-center justify-self-end px-6 py-3 md:block">
        <Buscador
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={closeMenu}
          className="mt-10 -translate-y-4 flex h-10 w-90 items-center rounded-full border-2 border-ud-rojo bg-white px-6 transition-[width] duration-300 focus-within:w-[500px]"
        />
        <AnimatePresence>
          {searchQuery.trim().length > 0 && (
            <SearchResults
              results={searchResults}
              onSelect={() => setSearchQuery("")}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav DESKTOP (original) ── */}
      <nav
        aria-label="Menú principal de navegación"
        className="relative col-span-2 row-start-3 hidden items-center justify-end gap-4 bg-black px-6 py-3 font-extrabold text-white md:flex"
      >
        <NuestraUniversidad
          onMouseEnter={() => setOpenMenu("universidad")}
          onMouseLeave={() => setOpenMenu(null)}
          isOpen={openMenu === "universidad"}          onToggle={() =>
            setOpenMenu((c) => (c === "universidad" ? null : "universidad"))
          }
          onClose={closeMenu}
        />
        
        <OfertaAcademica
          onMouseEnter={() => setOpenMenu("oferta")}
          onMouseLeave={() => setOpenMenu(null)}
          isOpen={openMenu === "oferta"}
          onToggle={() =>
            setOpenMenu((c) => (c === "oferta" ? null : "oferta"))
          }
          onClose={closeMenu}
        />
        <Internacionalizacion onClose={closeMenu} />
        <Aspirantes onClose={closeMenu} />
        <Campus
          onMouseEnter={() => setOpenMenu("campus")}
          onMouseLeave={() => setOpenMenu(null)}
          isOpen={openMenu === "campus"}
          onToggle={() =>
            setOpenMenu((c) => (c === "campus" ? null : "campus"))
          }
          onClose={closeMenu}
        />
      </nav>

      {/* ── Nav MOBILE (MENÚ + búsqueda) ── */}
      <div className="relative flex items-center justify-between bg-black md:hidden">
        <button
          type="button"
          onClick={() => {
            if (mobileOpen) {
              closeMobileMenu();
            } else {
              setMobileOpen(true);
            }
          }}
          className={styles.mobileMenuButton}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
          MENÚ
        </button>

        <button
          type="button"
          onClick={() => setMobileSearchOpen(true)}
          aria-label="Buscar en el sitio"
          className={styles.mobileSearchButton}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className={styles.mobilePanel}
              variants={mobilePanelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ transformOrigin: "top center" }}
            >
            {mobileStack.length > 0 && (
              <button
                type="button"
                onClick={() => setMobileStack((s) => s.slice(0, -1))}
                className={styles.mobileBackButton}
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Volver
              </button>
            )}

            <ul className={styles.mobileList}>
              {currentMobileItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                return (
                  <li key={item.href}>
                    {hasChildren ? (
                      <div className={styles.mobileItemRow}>
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={styles.mobileItemLink}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileStack((s) => [...s, item])}
                          className={styles.mobileItemExpand}
                          aria-label={`Abrir submenú de ${item.label}`}
                        >
                          <svg
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className={styles.mobileItemLink}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Búsqueda MOBILE a pantalla completa ── */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-white p-4 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              aria-label="Cerrar búsqueda"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-ud-rojo"
            >
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
            <input
              type="search"
              placeholder="Buscar en el sitio"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 min-w-0 flex-1 rounded-full border-2 border-ud-rojo bg-white px-4 text-sm font-semibold text-black outline-none"
            />
          </div>

          {searchQuery.trim().length > 0 && (
            <div className="mt-4 flex-1 overflow-y-auto">
              {searchResults.length > 0 ? (
                <ul className="space-y-1">
                  {searchResults.map(({ item, parents }) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          setSearchQuery("");
                          setMobileSearchOpen(false);
                        }}
                        className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-ud-rojo"
                      >
                        <span className="font-medium">{item.label}</span>
                        {parents.length > 0 && (
                          <span className="ml-2 text-xs text-gray-400">
                            {parents.join(" / ")}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-3 py-2 text-sm text-gray-500">
                  No se encontraron resultados.
                </p>
              )}
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
