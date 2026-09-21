"use client";

import { useEffect, useState, useMemo } from "react";
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

// 1. Unificamos todos los menús en un solo array
const allNavigationItems: NavigationItem[] = [
  nuestraUniversidadNavigation,
  campusNavigation,
  ofertaAcademicaNavigation,
];

// 2. Normalización de acentos y caracteres
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

// 3. Función recursiva de búsqueda
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

  const closeMenu = () => setOpenMenu(null);

  useEffect(() => {
    const closeMenusOnScroll = () => setOpenMenu(null);

    window.addEventListener("scroll", closeMenusOnScroll, { passive: true });

    return () => window.removeEventListener("scroll", closeMenusOnScroll);
  }, []);

  // 4. Calculamos los resultados directamente desde allNavigationItems
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchNavigation(allNavigationItems, searchQuery);
  }, [searchQuery]);

  return (
    <div className="contents">
      {/* Contenedor relativo para posicionar el dropdown de resultados */}
      <div className="relative col-start-2 row-start-2 self-center justify-self-end px-6 py-3">
        <Buscador
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={closeMenu}
        />

        {searchQuery.trim().length > 0 && (
          <SearchResults
            results={searchResults}
            onSelect={() => setSearchQuery("")}
          />
        )}
      </div>

      <nav
        aria-label="Menú principal de navegación"
        className="relative col-span-2 row-start-3 flex items-center justify-end gap-4 bg-black px-6 py-3 font-extrabold text-white"
      >
        <NuestraUniversidad
          isOpen={openMenu === "universidad"}
          onToggle={() =>
            setOpenMenu((current) =>
              current === "universidad" ? null : "universidad",
            )
          }
          onClose={closeMenu}
        />
        <OfertaAcademica
          isOpen={openMenu === "oferta"}
          onToggle={() =>
            setOpenMenu((current) => (current === "oferta" ? null : "oferta"))
          }
          onClose={closeMenu}
        />
        <Internacionalizacion onClose={closeMenu} />
        <Aspirantes onClose={closeMenu} />
                <Campus
          isOpen={openMenu === "campus"}
          onToggle={() =>
            setOpenMenu((current) => (current === "campus" ? null : "campus"))
          }
          onClose={closeMenu}
        />
      </nav>
    </div>
  );
}
