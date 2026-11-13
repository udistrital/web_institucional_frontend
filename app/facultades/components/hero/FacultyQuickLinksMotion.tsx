"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useHeroEntranceVariants } from "@/components/common/page-hero/page-hero-entrance-motion";

type MotionProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Lista de la pirámide: escalona la entrada de sus filas, de arriba abajo,
 * cuando el panel izquierdo del hero la lanza.
 */
export function QuickLinksList({ children, className }: MotionProps) {
  const { links } = useHeroEntranceVariants();

  return (
    <motion.ul className={className} variants={links}>
      {children}
    </motion.ul>
  );
}

/**
 * Fila de la pirámide: se anima el `li` y no el enlace, porque el `transform`
 * en línea de framer-motion anularía el desplazamiento del hover del CSS.
 */
export function QuickLinksItem({ children, className }: MotionProps) {
  const { link } = useHeroEntranceVariants();

  return (
    <motion.li className={className} variants={link}>
      {children}
    </motion.li>
  );
}
