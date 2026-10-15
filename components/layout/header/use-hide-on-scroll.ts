"use client";

import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

/**
 * Controla la visibilidad del header usando la API de framer-motion.
 *
 * - headerVisible: true al subir o estar cerca del tope; false al bajar.
 */
export function useHideOnScroll(hideAfter = 80) {
  const { scrollY } = useScroll();
  const [headerVisible, setHeaderVisible] = useState(true);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    
    // Histéresis: ±1px zona muerta
    const goingDown = y > prev + 1;
    const goingUp = y < prev - 1;

    if (goingDown) {
      setHeaderVisible(y <= hideAfter);
    } else if (goingUp) {
      setHeaderVisible(true);
    }
  });

  return { headerVisible };
}
