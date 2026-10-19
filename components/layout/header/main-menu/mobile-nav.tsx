"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

const panelTransition = {
  type: "tween" as const,
  duration: 0.28,
  ease: [0.32, 0.72, 0, 1] as const,
};

const levelTransition = {
  type: "tween" as const,
  duration: 0.24,
  ease: [0.32, 0.72, 0, 1] as const,
};

type MobileNavProps = {
  onOpenSearch: () => void;
};

export default function MobileNav({ onOpenSearch }: MobileNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileStack, setMobileStack] = useState<NavigationItem[]>([]);
  const [direction, setDirection] = useState<1 | -1>(1);
  const reduceMotion = useReducedMotion();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false);
    setMobileStack([]);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, closeMobileMenu]);

  const currentParent = mobileStack[mobileStack.length - 1];
  const currentMobileItems = currentParent
    ? currentParent.children ?? []
    : mobileMenuItems;

  const openLevel = useCallback((item: NavigationItem) => {
    setDirection(1);
    setMobileStack((s) => [...s, item]);
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setMobileStack((s) => s.slice(0, -1));
  }, []);

  const panel = (
    <AnimatePresence>
      {mobileOpen && (
        <>
          <motion.div
            key="backdrop"
            className={styles.mobileBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileMenu}
          />
          <motion.div
            key="panel"
            className={styles.mobilePanel}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={reduceMotion ? { duration: 0 } : panelTransition}
            role="dialog"
            aria-modal="true"
            aria-label="Menú principal"
          >
            <div className={styles.mobilePanelTop}>
              {currentParent ? (
                <button
                  type="button"
                  onClick={goBack}
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
              ) : (
                <span className={styles.mobilePanelLabel}>Menú</span>
              )}
              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Cerrar menú"
                className={styles.mobileCloseButton}
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
            </div>

            <div className={styles.mobilePanelBody}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileStack.length}
                  className={styles.mobileLevel}
                  initial={{ x: direction > 0 ? "30%" : "-30%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? "-30%" : "30%", opacity: 0 }}
                  transition={reduceMotion ? { duration: 0 } : levelTransition}
                >
                  {currentParent && (
                    <Link
                      href={currentParent.href}
                      onClick={closeMobileMenu}
                      className={styles.mobileLevelTitle}
                    >
                      <span>{currentParent.label}</span>
                      <span className={styles.mobileLevelTitleHint}>Ver todo &rarr;</span>
                    </Link>
                  )}

                  <motion.ul
                    className={styles.mobileList}
                    initial="hidden"
                    animate="visible"
                    variants={
                      reduceMotion
                        ? undefined
                        : {
                            hidden: {},
                            visible: {
                              transition: { staggerChildren: 0.04, delayChildren: 0.04 },
                            },
                          }
                    }
                  >
                    {currentMobileItems.map((item) => {
                      const hasChildren = !!item.children?.length;
                      return (
                        <motion.li
                          key={item.href}
                          variants={
                            reduceMotion
                              ? undefined
                              : {
                                  hidden: { opacity: 0, y: 8 },
                                  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
                                }
                          }
                        >
                          {hasChildren ? (
                            <button
                              type="button"
                              onClick={() => openLevel(item)}
                              className={styles.mobileItemButton}
                            >
                              {item.label}
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
                          ) : (
                            <Link
                              href={item.href}
                              onClick={closeMobileMenu}
                              className={styles.mobileItemLink}
                            >
                              {item.label}
                            </Link>
                          )}
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex w-full items-center justify-between gap-2 md:hidden">
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-expanded={mobileOpen}
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
          <path d="M4 6h16" />
          <path d="M4 12h16" />
          <path d="M4 18h16" />
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

      {mounted && createPortal(panel, document.body)}
    </div>
  );
}
