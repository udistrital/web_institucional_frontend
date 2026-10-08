"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { mobilePanelVariants } from "../dropdown-motion";
import {
  type NavigationItem,
  campusNavigation,
  nuestraUniversidadNavigation,
  ofertaAcademicaNavigation,
} from "./shared/navigation";
import { SearchIcon } from "./shared/icons";
import styles from "./main-menu.module.css";

// Items del menú mobile (capa 1)
const mobileMenuItems: NavigationItem[] = [
  nuestraUniversidadNavigation,
  ofertaAcademicaNavigation,
  { label: "Internacionalización", href: "/internacionalizacion" },
  { label: "Estudia en la UD", href: "/aspirantes" },
  campusNavigation,
];

type MobileNavProps = {
  onOpenSearch: () => void;
};

export default function MobileNav({ onOpenSearch }: MobileNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileStack, setMobileStack] = useState<NavigationItem[]>([]);

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setMobileStack([]);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMobileMenu]);

  // Items visibles en la capa actual del menú mobile
  const currentMobileItems =
    mobileStack.length === 0
      ? mobileMenuItems
      : mobileStack[mobileStack.length - 1].children ?? [];

  return (
    <div className="relative flex flex-1 items-center justify-end gap-1 md:hidden">
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
        onClick={onOpenSearch}
        aria-label="Buscar en el sitio"
        className={styles.mobileSearchButton}
      >
        <SearchIcon className="h-5 w-5" />
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
  );
}
