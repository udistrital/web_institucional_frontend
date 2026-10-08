"use client";

import type { Variants } from "framer-motion";

/**
 * Variantes diferenciadas para los desplegables del header.
 * - audience: sutil, para los dropdowns pequeños de AudienceNav.
 * - compact: Nuestra Universidad (panel angosto anclado al botón).
 * - fullWidth: Campus / Oferta Académica (panel ancho bajo la barra negra).
 * - search: resultados del buscador desktop.
 * - mobilePanel: panel del menú mobile.
 *
 * El dropup es el estado `exit` (reverso de la entrada).
 * El `transformOrigin` se fija en cada uso vía `style`.
 */

export const audienceDropdownVariants: Variants = {
  hidden: { opacity: 0, y: -4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 520,
      damping: 38,
      mass: 0.7,
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: {
      type: "spring",
      stiffness: 640,
      damping: 44,
      mass: 0.6,
    },
  },
};

export const compactMenuVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    pointerEvents: "auto",
    transition: {
      duration: 0.22,
      ease: "easeOut",
      delayChildren: 0.05,
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    pointerEvents: "none",
    transition: { duration: 0.18, ease: "easeIn" },
  },
};

export const fullWidthMenuVariants: Variants = {
  hidden: { opacity: 0, y: -12, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: {
      duration: 0.2,
      ease: "easeOut",
      delayChildren: 0.05,
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    pointerEvents: "none",
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

/**
 * Versión acelerada de `fullWidthMenuVariants` para Oferta Académica:
 * misma cascada pero con tiempos más cortos (apertura total ~0.3s).
 */
export const ofertaMenuVariants: Variants = {
  hidden: { opacity: 0, y: -8, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: {
      duration: 0.15,
      ease: "easeOut",
      delayChildren: 0.02,
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    pointerEvents: "none",
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

/**
 * Hija de `ofertaMenuVariants`: igual que `menuSectionVariants` pero
 * con duración reducida para acompañar la apertura rápida.
 */
export const ofertaSectionVariants: Variants = {
  hidden: { opacity: 0, y: 8, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 6,
    pointerEvents: "none",
    transition: { duration: 0.1, ease: "easeIn" },
  },
};

/**
 * Hija de `fullWidthMenuVariants`: cada columna (`<section>`) del mega menú
 * entra flotando en cascada de izquierda a derecha. Usar como
 * `<motion.section variants={menuSectionVariants}>` dentro del contenedor
 * que usa `fullWidthMenuVariants` (sin `initial`/`animate` propios:
 * los hereda del padre por propagación).
 */
export const menuSectionVariants: Variants = {
  hidden: { opacity: 0, y: 12, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 8,
    pointerEvents: "none",
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

export const searchResultsVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.98, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    pointerEvents: "auto",
    transition: { duration: 0.16, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    pointerEvents: "none",
    transition: { duration: 0.14, ease: "easeIn" },
  },
};

export const mobilePanelVariants: Variants = {
  hidden: { opacity: 0, y: -12, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    pointerEvents: "auto",
    transition: { duration: 0.22, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -12,
    pointerEvents: "none",
    transition: { duration: 0.18, ease: "easeIn" },
  },
};
