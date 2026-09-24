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
  hidden: { opacity: 0, y: -6, scale: 0.98, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    pointerEvents: "auto",
    transition: { duration: 0.18, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    pointerEvents: "none",
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const compactMenuVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    pointerEvents: "auto",
    transition: { duration: 0.22, ease: "easeOut" },
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
  hidden: { opacity: 0, y: -12, scale: 0.99, pointerEvents: "none" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    pointerEvents: "auto",
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.99,
    pointerEvents: "none",
    transition: { duration: 0.2, ease: "easeIn" },
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
