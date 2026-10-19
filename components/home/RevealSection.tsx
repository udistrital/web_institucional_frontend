"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealSectionProps = {
  children: ReactNode;
  delay?: number;
};

export default function RevealSection({ children, delay = 0 }: RevealSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      // Mantiene el contenido visible incluso si la animación de viewport no
      // llega a ejecutarse (por ejemplo, antes de hidratar o en móviles).
      initial={reduceMotion ? false : { opacity: 1, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -8%" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
