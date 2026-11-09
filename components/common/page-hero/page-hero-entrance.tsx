"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useHeroEntranceVariants } from "./page-hero-entrance-motion";

type EntranceProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Panel izquierdo del hero "brand-diagonal": lanza la entrada una sola vez al
 * montar. Los hijos animados (tarjeta, logo, texto y botones) heredan
 * "hidden"/"visible" y solo definen sus variantes.
 */
export function HeroEntrance({ children, className }: EntranceProps) {
  return (
    <motion.div animate="visible" className={className} initial="hidden">
      {children}
    </motion.div>
  );
}

/** Tarjeta del título: entra desde fuera por la izquierda. */
export function HeroEntranceCard({ children, className }: EntranceProps) {
  const { card } = useHeroEntranceVariants();

  return (
    <motion.div className={className} variants={card}>
      {children}
    </motion.div>
  );
}

/** Envoltorio del logo UD (el SVG no recibe ref): aparece y escala. */
export function HeroEntranceLogo({ children, className }: EntranceProps) {
  const { logo } = useHeroEntranceVariants();

  return (
    <motion.span className={className} variants={logo}>
      {children}
    </motion.span>
  );
}

/** Título de la página: aparece subiendo unos píxeles. */
export function HeroEntranceTitle({ children, className }: EntranceProps) {
  const { title } = useHeroEntranceVariants();

  return (
    <motion.h1 className={className} variants={title}>
      {children}
    </motion.h1>
  );
}
