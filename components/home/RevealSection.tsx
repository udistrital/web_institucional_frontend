"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealSectionProps = {
  children: ReactNode;
  delay?: number;
  disableMotion?: boolean;
};

export default function RevealSection({ children, delay = 0, disableMotion = false }: RevealSectionProps) {
  const reduceMotion = useReducedMotion();
  const shouldDisableMotion = reduceMotion || disableMotion;

  return (
    <motion.div
      // Mantiene el contenido visible incluso si la animación de viewport no
      // llega a ejecutarse (por ejemplo, antes de hidratar o en móviles).
      initial={shouldDisableMotion ? false : { opacity: 1, y: 12 }}
      whileInView={shouldDisableMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -8%" }}
      transition={
        shouldDisableMotion
          ? { duration: 0 }
          : { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
